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

const projectClickHandler = (e) => {
    // Retrieve the project number via dataset
    const selectedProject = e.target.dataset.projectNo;

    // Clicking an open project will close it
    if (
        document.querySelector(`[data-projectcontainer="${selectedProject}"]`)
    ) {
        document
            .querySelector(`[data-projectcontainer="${selectedProject}"]`)
            .remove();
        return;
    }

    displayTodos(selectedProject);
};

const displayProjects = (projectList) => {
    // reset the page
    if (document.querySelector('#project-container')) {
        document.querySelector('#project-container').remove();
    }

    const projectContainer = document.createElement('div');
    projectContainer.setAttribute('id', 'project-container');
    document.body.appendChild(projectContainer);

    // Make a button for every project in the list
    projectList.forEach((project, index) => {
        const currentProject = document.createElement('button');
        currentProject.textContent = `Project ${index}`;
        currentProject.classList.add('project-button');
        currentProject.dataset.projectNo = index;
        currentProject.addEventListener('click', projectClickHandler);
        projectContainer.appendChild(currentProject);
    });

    // Make a button for adding a new project
    const newProject = document.createElement('button');
    newProject.textContent = 'Create New Project';
    newProject.classList.add('project-button');
    newProject.classList.add('new-project-button');
    newProject.dataset.projectNo = 'new';
    newProject.addEventListener('click', createNewProject);
    projectContainer.appendChild(newProject);
};

const displayTodos = (projectNo) => {
    // close any open todos
    if (document.querySelector('.todo-container')) {
        document.querySelector('.todo-container').remove();
    }
    const newTodoContainer = document.createElement('div');
    newTodoContainer.classList.add('todo-container');
    newTodoContainer.dataset.projectcontainer = projectNo;
    const currentProject = document.querySelector(
        `[data-project-no="${projectNo}"]`
    );
    currentProject.insertAdjacentElement('afterend', newTodoContainer);

    dummyData[projectNo].forEach((todo, index) => {
        const newTodoCard = document.createElement('div');
        newTodoCard.dataset.card = `${projectNo}-${index}`;
        newTodoCard.classList.add('todo-card');
        newTodoCard.textContent = todo.name;

        newTodoCard.addEventListener('click', todoClickHandler);

        newTodoContainer.appendChild(newTodoCard);
    });

    // Make a button for adding a new todo
    const newTodoCard = document.createElement('div');
    newTodoCard.dataset.card = `${projectNo}-new`;
    newTodoCard.classList.add('todo-card');
    newTodoCard.textContent = 'Add New';
    newTodoCard.addEventListener('click', createNewTodo);
    newTodoContainer.appendChild(newTodoCard);
};

const todoClickHandler = (e) => {
    //const selectedTodo = e.target.dataset.todoNo;
    const selectedTodo = e.target.dataset.card;
    if (!selectedTodo) return;
    displayData(selectedTodo);
};

const displayData = (todoNo) => {
    // Reset any open todo containers
    if (document.querySelector('.data-container')) {
        document.querySelector('.data-container').remove();
        document
            .querySelector('.current-card')
            .classList.remove('current-card');
    }

    const coordinates = todoNo.split('-');
    const currentTodoCard = document.querySelector(
        `[data-card="${coordinates[0]}-${coordinates[1]}"]`
    );
    if (currentTodoCard.classList.contains('current-card')) {
        currentTodoCard.classList.remove('current-card');
    } else {
        currentTodoCard.classList.add('current-card');

        const dataContainer = document.createElement('div');
        dataContainer.classList.add('data-container');
        currentTodoCard.appendChild(dataContainer);

        const todoDescription = document.createElement('div');
        todoDescription.textContent =
            dummyData[coordinates[0]][coordinates[1]].desc;
        dataContainer.appendChild(todoDescription);

        const todoDate = document.createElement('div');
        todoDate.textContent =
            dummyData[coordinates[0]][coordinates[1]].duedate;
        dataContainer.appendChild(todoDate);

        const todoNotes = document.createElement('div');
        todoNotes.textContent = dummyData[coordinates[0]][coordinates[1]].notes;
        dataContainer.appendChild(todoNotes);
    }
};

const createNewProject = () => {
    // close any open todos
    if (document.querySelector('.todo-container')) {
        document.querySelector('.todo-container').remove();
    }
    /*
    newProject = makeProject(5);
    dummyData.push(newProject);
    */

    // Modal creation
    const projectModal = document.createElement('div');
    projectModal.setAttribute('id', 'project-modal');
    document.body.appendChild(projectModal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    projectModal.appendChild(modalContent);

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('modal-input-div');
    modalContent.appendChild(inputDiv);

    const inputTitle = document.createElement('div');
    inputTitle.classList.add('modal-input-title');
    inputTitle.textContent = 'Name of new Project: ';
    inputDiv.appendChild(inputTitle);

    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.classList.add('modal-input-field');
    inputDiv.appendChild(inputField);
    inputField.focus();
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            console.log('Enter registered');
        }
    });

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.onclick = () => {
        projectModal.remove();
    };
    modalContent.appendChild(closeButton);

    // Clicking on 'projectModal' (which is any area outisde of the content box) will close the window
    window.onclick = (event) => {
        if (event.target == projectModal) {
            projectModal.remove();
        }
    };

    // displayProjects(dummyData);
};

const createNewTodo = () => {
    // close any open todo cards
    if (document.querySelector('.data-container')) {
        document.querySelector('.data-container').remove();
        document
            .querySelector('.current-card')
            .classList.remove('current-card');
    }
};

// Start

displayProjects(dummyData);
