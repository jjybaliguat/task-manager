const Task = require('../model/Task')
const asyncHandler = require('express-async-handler')


const getAllTask = asyncHandler( async (re,res)  => {
        const tasks = await Task.find({})
        res.status(200).json({
            tasks
        })
}
)
const getTask = asyncHandler( async (req,res)  => {
        const {id:taskId} = req.params
        const task = await Task.findOne({_id:taskId})
        
        if(!task){
            res.status(404)
            throw new Error(`No task with an id of ${taskId}`)
        }
        res.status(200).json({
            task
        })
})

const createTask = asyncHandler(async (req,res) => {
        const name = req.body
        const task = await Task.create(name)
        res.status(200).json({
            task
        })
})

const updateTask = asyncHandler(async (req,res) => {
        const {id:taskID} = req.params
        const name = req.body
        
        const task =  await Task.findOneAndUpdate({_id:taskID}, req.body)

        if(!task){
            res.status(404)
            throw new Error(`No task with an id of ${taskID}`)
        }
        res.status(200).json({
            success: true,
            msg: "Task updated succesfully"
        })
})
const deleteTask = asyncHandler(async (req,res) => {
        const {id:taskID} = req.params
        const task = await Task.findOneAndDelete({_id:taskID})
        if(!task){
            res.status(404)
            throw new Error(`No task with an id of ${taskID}`)
        }
        res.status(200).json({
            success: true,
            msg: "Task deleted succesfully"
        })
})

module.exports = {
    getAllTask,
    getTask,
    createTask,
    updateTask,
    deleteTask
}