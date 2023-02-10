const taskFormDom = document.querySelector('.task-form')
const noTaskDom = document.querySelector('.no-task')
const taskDom = document.querySelector('.tasks')
const formAlert = document.querySelector('.form-alert')
const alertMessage = document.querySelector('.alert-message')
const taskInput = document.querySelector('.input-task')
const deleteBtn = document.querySelector('.delete-btn')
const deleteTaskId = document.querySelector('#deleteTaskId')
const editTaskId = document.querySelector('#editTaskId')
const deleteSubmit = document.querySelector('#deleteSubmit')
const editSubmit = document.querySelector('#editSubmit')
const taskName = document.querySelector('#taskName')
const taskStatus = document.querySelector('#taskStatus')

// Get all tasks
const getTasks = async () => {
    try {
        const {data: {tasks}} = await axios.get('./api/v1/tasks')

        if(tasks.length < 1){
            noTaskDom.style.display = 'block'
            noTaskDom.textContent  = 'You have no Task yet'
            taskDom.innerHTML = ''
            return
        }
        const allTasks = tasks.map((task) => {
            const { completed, _id: taskID,  name} = task

            return `<div class="single-task ${completed && 'task-completed'}">
            <h5><span><i class="far fa-check-circle"></i></i></span>${name}</h5>
            <div class="task-links">
                <button type="button" class="edit-btn text-warning" data-completed="${completed}" data-name="${name}" data-id="${taskID}" data-toggle="modal" data-target="#editTaskModal">
                <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn text-danger" data-id="${taskID}" data-toggle="modal" data-target="#deleteTaskModal">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`
        }).join('')

        noTaskDom.style.display = 'none'
        noTaskDom.textContent  = ''
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
    if(!name){
        formAlert.style.display = 'block'
        formAlert.textContent = 'Please enter task name'
        formAlert.classList.add('text-danger')
        setTimeout(() => {
            formAlert.style.display = 'none'
            formAlert.classList.remove('text-success')
            formAlert.classList.remove('text-danger')
          }, 3000)
        return
    }else if(name.length > 20){
        formAlert.style.display = 'block'
        formAlert.textContent = 'Name cannot be more than 20 characters'
        formAlert.classList.add('text-danger')
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
        deleteTaskId.value = id
    }
})

deleteSubmit.addEventListener('click', async (e) => {
    const id = deleteTaskId.value
    deleteSubmit.innerHTML = 'Deleting...'
    try {
        await axios.delete(`/api/v1/tasks/${id}`)
        alertMessage.style.display = 'block'
        alertMessage.textContent = 'Task Deleted Successfully'
        alertMessage.classList.add('bg-success')
        getTasks()
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

//  edit task

taskDom.addEventListener('click', (e) => {
    const el = e.target
    editSubmit.innerHTML = 'Save'

    if (el.parentElement.classList.contains('edit-btn')) {
        const id = el.parentElement.dataset.id
        const name = el.parentElement.dataset.name
        const completed = el.parentElement.dataset.completed
        editTaskId.value = id
        taskName.value = name
        completed === "true" ? taskStatus.checked = true : taskStatus.checked = false
    }
})

editSubmit.addEventListener('click', async (e) => {
    const id = editTaskId.value
    editSubmit.innerHTML = 'Saving...'
    try {
        await axios.patch(`/api/v1/tasks/${id}`, {
            name: taskName.value,
            completed: taskStatus.checked
        })
        alertMessage.style.display = 'block'
        alertMessage.textContent = 'Task Updated Successfully'
        alertMessage.classList.add('bg-success')
        getTasks()
    } catch (error) {
        alertMessage.style.display = 'block'
        alertMessage.textContent = 'Failed Updating task'
        alertMessage.classList.add('bg-danger')
    }setTimeout(() => {
        alertMessage.style.display = 'none'
        alertMessage.classList.remove('bg-success')
        alertMessage.classList.remove('bg-danger')
      }, 3000)
})

