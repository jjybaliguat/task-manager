const taskFormDom = document.querySelector('.task-form')
const noTaskDom = document.querySelector('.no-task')
const taskDom = document.querySelector('.tasks')
const formAlert = document.querySelector('.form-alert')
const alertMessage = document.querySelector('.alert-message')
const taskInput = document.querySelector('.input-task')
const deleteBtn = document.querySelector('.delete-btn')
const taskId = document.querySelector('#taskId')
const deleteSubmit = document.querySelector('#deleteSubmit')

// Get all tasks
const getTasks = async () => {
    try {
        const {data: {tasks}} = await axios.get('./api/v1/tasks')

        if(tasks.length < 1){
            noTaskDom.style.display = 'block'
            noTaskDom.textContent  = 'Task is Empty'
        }
        const allTasks = tasks.map((task) => {
            const { completed, _id: taskID,  name} = task

            return `<div class="single-task ${completed && 'task-completed'}">
            <h5><span><i class="far fa-check-circle"></i></i></span>${name}</h5>
            <div class="task-links">
                <a href="task.html?id=${taskID}"  class="edit-link text-warning">
                    <i class="fas fa-edit"></i>
                </a>
                <button type="button" class="delete-btn text-danger" data-id="${taskID}" data-toggle="modal" data-target="#deleteTaskModal">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`
        }).join('')

        noTaskDom.style.display = 'none'
        taskDom.innerHTML = allTasks
    } catch (error) {
        console.log(error);
        taskDom.innerHTML = '<h3 class="text-center text-danger">There was an error, please try later....</h3>'
    }
}

getTasks()

// add task

taskFormDom.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = taskInput.value
    if(!name.length){
        formAlert.style.display = 'block'
        formAlert.textContent = 'Please enter task name'
        formAlert.classList.add('text-danger')
        setTimeout(() => {
            formAlert.style.display = 'none'
            formAlert.classList.remove('text-success')
            formAlert.classList.remove('text-danger')
          }, 3000)
        return
    }

    try {
        await axios.post('/api/v1/tasks', {name})
        getTasks()
        taskInput.value = ''
        formAlert.style.display = 'block'
        formAlert.textContent = 'Task added successfully'
        formAlert.classList.remove('text-danger')
        formAlert.classList.add('text-success')
    } catch (error) {
        formAlert.style.display = 'block'
        formAlert.textContent = 'Failed, please try again'
        formAlert.classList.add('text-danger')
    }
    setTimeout(() => {
        formAlert.style.display = 'none'
        formAlert.classList.remove('text-success')
        formAlert.classList.remove('text-danger')
      }, 3000)
})

// Delete task

taskDom.addEventListener('click', (e) => {
    const el = e.target
    deleteSubmit.innerHTML = 'Yes'
    if (el.parentElement.classList.contains('delete-btn')) {
        const id = el.parentElement.dataset.id
        taskId.value = id
    }
})

deleteSubmit.addEventListener('click', async (e) => {
    const id = taskId.value
    deleteSubmit.innerHTML = 'Deleting...'
    try {
        await axios.delete(`/api/v1/tasks/${id}`)
        getTasks()
        alertMessage.style.display = 'block'
        alertMessage.textContent = 'Task Deleted Successfully'
        alertMessage.classList.add('bg-success')
    } catch (error) {
        alertMessage.style.display = 'block'
        alertMessage.textContent = 'Failed Deleting task'
        alertMessage.classList.add('bg-danger')
    }setTimeout(() => {
        alertMessage.style.display = 'none'
        alertMessage.classList.remove('bg-success')
        alertMessage.classList.remove('bg-danger')
      }, 3000)
})