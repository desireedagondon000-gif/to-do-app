const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');

const pendingList = document.getElementById('pending-list');
const inprogressList = document.getElementById('inprogress-list');
const completedList = document.getElementById('completed-list');

const pendingCount = document.getElementById('pending-count');
const inprogressCount = document.getElementById('inprogress-count');
const completedCount = document.getElementById('completed-count');

const modal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

const downloadButtons = document.querySelectorAll('.download-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let deleteIndex = null;

// Render tasks
function renderTasks() {
    pendingList.innerHTML = '';
    inprogressList.innerHTML = '';
    completedList.innerHTML = '';

    let pending = 0, inprogress = 0, completed = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        // Status icon using Font Awesome
        let iconHTML = '';
        if(task.status==='pending') iconHTML='<i class="fas fa-hourglass-start"></i>';
        else if(task.status==='inprogress') iconHTML='<i class="fas fa-spinner"></i>';
        else iconHTML='<i class="fas fa-check-circle"></i>';

        // Task text
        const span = document.createElement('span');
        span.className='task-text';
        span.innerHTML = `${iconHTML} ${task.text}`;
        li.appendChild(span);

        // Status select
        const statusSelect = document.createElement('select');
        statusSelect.className='status-select '+task.status;
        [
            {value:'pending', text:'Pending'},
            {value:'inprogress', text:'In Progress'},
            {value:'completed', text:'Completed'}
        ].forEach(s=>{
            const opt = document.createElement('option');
            opt.value = s.value;
            opt.textContent = s.text;
            if(task.status===s.value) opt.selected=true;
            statusSelect.appendChild(opt);
        });
        statusSelect.onchange = ()=>{
            task.status = statusSelect.value;
            statusSelect.className='status-select '+task.status;
            saveTasks();
        }
        li.appendChild(statusSelect);

        // Buttons
        const controls = document.createElement('div');
        controls.className='task-controls';
        const editBtn = document.createElement('button');
        editBtn.className='edit-btn';
        editBtn.innerHTML='<i class="fas fa-pen"></i>';
        editBtn.onclick=()=>editTask(index);
        const deleteBtn = document.createElement('button');
        deleteBtn.className='delete-btn';
        deleteBtn.innerHTML='<i class="fas fa-trash"></i>';
        deleteBtn.onclick=()=>showDeleteModal(index);
        controls.appendChild(editBtn);
        controls.appendChild(deleteBtn);
        li.appendChild(controls);

        // Append to proper list
        if(task.status==='pending'){ pendingList.appendChild(li); pending++; }
        else if(task.status==='inprogress'){ inprogressList.appendChild(li); inprogress++; }
        else { completedList.appendChild(li); completed++; }
    });

    pendingCount.textContent=`Pending: ${pending}`;
    inprogressCount.textContent=`In Progress: ${inprogress}`;
    completedCount.textContent=`Completed: ${completed}`;
}

// Add task
addBtn.onclick=()=>{
    const text=taskInput.value.trim();
    if(!text) return;
    tasks.push({text,status:'pending'});
    taskInput.value='';
    saveTasks();
}
taskInput.addEventListener('keypress', e=>{ if(e.key==='Enter') addBtn.click(); });

// Edit task
function editTask(index){
    const newText = prompt('Edit task:',tasks[index].text);
    if(newText){ tasks[index].text=newText.trim(); saveTasks(); }
}

// Delete modal
function showDeleteModal(index){ deleteIndex=index; modal.style.display='flex'; }
confirmDeleteBtn.onclick=()=>{ if(deleteIndex!==null){ tasks.splice(deleteIndex,1); deleteIndex=null; saveTasks(); } modal.style.display='none'; }
cancelDeleteBtn.onclick=()=>{ deleteIndex=null; modal.style.display='none'; }
window.onclick=e=>{ if(e.target===modal){ deleteIndex=null; modal.style.display='none'; } }

// Download per status
downloadButtons.forEach(btn=>{
    btn.onclick=()=>{
        const status=btn.dataset.status;
        const filtered = tasks.filter(t=>t.status===status);
        if(filtered.length===0) return alert('No tasks in this list!');
        const content = filtered.map((t,i)=>`${i+1}. ${t.text}`).join('\n');
        const blob = new Blob([content],{type:'text/plain'});
        const a=document.createElement('a');
        a.href=URL.createObjectURL(blob);
        a.download=`${status}-tasks.txt`;
        a.click();
    }
});

// Save and render
function saveTasks(){
    localStorage.setItem('tasks',JSON.stringify(tasks));
    renderTasks();
}

// Initial render
renderTasks();