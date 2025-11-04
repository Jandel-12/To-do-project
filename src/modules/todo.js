
export default class ToDo {
  constructor(task, description, duedate, priority, projectCategory) {
    this.task = task;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
    this.projectCategory = projectCategory;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}