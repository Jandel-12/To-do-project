import ToDo from "./todo.js";
//main Goal
//holds the todo
//create project then push it

export default class Project{
    constructor(name){
        this.name = name
        this.toDoStorage = []
    }

    createTask(task, description, duedate, priority){
       const createTask = new ToDo(task, description, duedate, priority, this.name);
       this.toDoStorage.push(createTask);
    }

    getAllTask(){
        return this.toDoStorage
    }

    findTask(name) {
        const task = this.toDoStorage.findIndex(element => element.task === name);
        return task !== -1 ? task : "Task Doesn't Exist";
    }

    removeTask(index){
        this.toDoStorage.splice(index, 1);
        return this.toDoStorage
    }


}
