import ProjectManager from "./modules/projectManager.js";

const manager = new ProjectManager();
manager.addProject("School");
manager.addProject("Work");

manager.addTodoToProject("School","Jandel","Jandel","Jandel","mid")

console.log(manager.project[0])