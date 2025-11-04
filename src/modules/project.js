import ToDo from "./todo.js";


export default class Project{
    constructor(name){
        this.name = name
        this.todos = [];
    }

    createProject(task, description, duedate, priority){
       const createTask = new ToDo(task, description, duedate, priority, this.name);
       this.todos.push(createTask);
    }

    
    deleteTodo(index) {
        this.todos.splice(index, 1);
    }

    getTodo(){
        return this.todos;
    }
}

