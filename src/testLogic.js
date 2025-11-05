import "./style.css";
import Project from "./modules/project.js";
import ProjectManager from "./modules/projectManager.js";
import { renderTodo, renderProjects } from "./modules/dom.js";
import { el } from "date-fns/locale";


const manager = new ProjectManager();

manager.addProject("School");


manager.addTodoToProject("School","Jandel","Jandel","Jandel","mid");


manager.getAllProject().forEach(element => {
    renderProjects(element.name)
});