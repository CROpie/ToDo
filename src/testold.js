const project1button = document.querySelector('#p1b');
const project1todo1button = document.querySelector('#p1t1b');
const project1todo1 = document.querySelector('#p1t1');

// Creating dummy data
const makeTodo = (index) => {
    const newTodo = {};
    newTodo.name = `todo-${index}`;
    newTodo.desc = 'description';
    newTodo.duedate = 'yyyy-mm-dd hh:mm';
    newTodo.notes = 'notes such as this';
    newTodo.index = index;
    return newTodo;
};

const makeProject = (noTodos) => {
    const newProject = [];
    for (let i = 0; i < noTodos; i++) {
        newProject.push(makeTodo(i));
    }
    return newProject;
};

const makeProjectList = (noProjects) => {
    const newProjectList = [];
    for (let i = 0; i < noProjects; i++) {
        newProjectList[i] = makeProject(5);
    }
    return newProjectList;
};

const dummyData = makeProjectList(3);

const showTodo = () => {
    alert('button is operational');
};

const showDetails = () => {
    if (project1todo1.classList.contains('current-card')) {
        project1todo1.classList.remove('current-card');
    } else {
        project1todo1.classList.add('current-card');
    }
};

// later need to add showTodo(info about which button was pressed)
project1button.addEventListener('click', showTodo);
project1todo1button.addEventListener('click', showDetails);
