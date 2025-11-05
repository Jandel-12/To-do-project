import "./style.css"
import ProjectManager from './modules/projectManager.js';
import DOMController from './modules/dom.js';

const projectManager = new ProjectManager();
const domController = new DOMController(projectManager);

// Add test projects
projectManager.addProject('Work');
projectManager.addProject('Personal');

// Add some todos to "Work" project
projectManager.addTodoToProject('Work', 'Finish report', 'Complete quarterly report', '2024-12-01', 'high');
projectManager.addTodoToProject('Work', 'Team meeting', 'Discuss project roadmap', '2024-11-15', 'medium');
projectManager.addTodoToProject('Work', 'Code review', 'Review pull requests', '2024-11-10', 'low');

// Add todo to "Personal" project
projectManager.addTodoToProject('Personal', 'Buy groceries', 'Milk, eggs, bread', '2024-11-06', 'medium');

// Initialize
domController.init();