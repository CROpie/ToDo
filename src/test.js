// Creating dummy data
const makeDummyTodo = (index) => {
    const newTodo = {};
    newTodo.name = `todo-${index}`;
    newTodo.desc = 'description';
    newTodo.duedate = 'yyyy-mm-dd hh:mm';
    newTodo.notes = 'notes such as this';
    newTodo.index = index;
    return newTodo;
};

const makeDummyProject = (noTodos, index) => {
    const newProject = {};
    newProject.name = `Project - ${index}`;
    newProject.data = [];
    newProject.index = index;
    for (let i = 0; i < noTodos; i++) {
        newProject.data.push(makeDummyTodo(i));
    }
    return newProject;
};

const makeDummyProjectList = (noProjects) => {
    const newProjectList = [];
    for (let i = 0; i < noProjects; i++) {
        newProjectList[i] = makeDummyProject(5, i);
    }
    return newProjectList;
};

const dummyData = makeDummyProjectList(3);

const updateTodo = (projectNo, modifyData) => {
    const currentIndex = modifyData.index;
    console.log(modifyData);
    //dummyData[projectNo].data[currentIndex] = modifyData;
    dummyData[projectNo].data.splice(currentIndex, 1, modifyData);
};

const makeTodo = (projectNo, inputData) => {
    const currentProject = dummyData[projectNo].data;
    const index = currentProject.length;
    inputData.index = index;
    currentProject.push(inputData);
};

const makeProject = (newProjectTitle) => {
    const newProject = {};
    const index = dummyData.length;
    newProject.name = newProjectTitle;
    newProject.data = [];
    newProject.index = index;
    dummyData.push(newProject);
};

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
    projectList.forEach((project) => {
        const currentProject = document.createElement('button');
        currentProject.textContent = project.name;
        currentProject.classList.add('project-button');
        currentProject.dataset.projectNo = project.index;
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

    dummyData[projectNo].data.forEach((todo, index) => {
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
    newTodoCard.onclick = () => {
        createNewTodo(projectNo);
    };
    //newTodoCard.addEventListener('click', createNewTodo);
    newTodoContainer.appendChild(newTodoCard);
};

const todoClickHandler = (e) => {
    //const selectedTodo = e.target.dataset.todoNo;
    const selectedTodo = e.target.dataset.card;
    if (!selectedTodo) return;
    displayData(selectedTodo);
};

const modifyTodo = (currentProject, todoData) => {
    // close any open todo cards?

    // Modal Creation
    const todoModal = document.createElement('div');
    todoModal.setAttribute('id', 'project-modal');
    document.body.appendChild(todoModal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    todoModal.appendChild(modalContent);

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('modal-input-div');
    modalContent.appendChild(inputDiv);

    const inputTitle = document.createElement('div');
    inputTitle.classList.add('modal-input-title');
    inputTitle.textContent = 'Name of Todo: ';
    inputDiv.appendChild(inputTitle);

    const inputFieldTitle = document.createElement('input');
    inputFieldTitle.setAttribute('type', 'text');
    inputFieldTitle.classList.add('modal-input-field');
    inputFieldTitle.value = todoData.name;
    inputDiv.appendChild(inputFieldTitle);
    inputFieldTitle.focus();

    const inputDesc = document.createElement('div');
    inputDesc.classList.add('modal-input-title');
    inputDesc.textContent = 'Description: ';
    inputDiv.appendChild(inputDesc);

    const inputFieldDesc = document.createElement('input');
    inputFieldDesc.setAttribute('type', 'text');
    inputFieldDesc.classList.add('modal-input-field');
    inputFieldDesc.value = todoData.desc;
    inputDiv.appendChild(inputFieldDesc);

    const inputDuedate = document.createElement('div');
    inputDuedate.classList.add('modal-input-title');
    inputDuedate.textContent = 'Due Date: ';
    inputDiv.appendChild(inputDuedate);

    const inputFieldDuedate = document.createElement('input');
    inputFieldDuedate.setAttribute('type', 'text');
    inputFieldDuedate.classList.add('modal-input-field');
    inputFieldDuedate.value = todoData.duedate;
    inputDiv.appendChild(inputFieldDuedate);

    const inputNotes = document.createElement('div');
    inputNotes.classList.add('modal-input-title');
    inputNotes.textContent = 'Notes: ';
    inputDiv.appendChild(inputNotes);

    const inputFieldNotes = document.createElement('input');
    inputFieldNotes.setAttribute('type', 'text');
    inputFieldNotes.classList.add('modal-input-field');
    inputFieldNotes.value = todoData.notes;
    inputDiv.appendChild(inputFieldNotes);

    const inputButton = document.createElement('button');
    inputButton.setAttribute('type', 'button');
    inputButton.classList.add('modal-submit-button');
    inputButton.textContent = 'Submit';
    inputButton.onclick = () => {
        // Gather data
        const modifyTodo = {};
        modifyTodo.name = inputFieldTitle.value;
        modifyTodo.desc = inputFieldDesc.value;
        modifyTodo.duedate = inputFieldDuedate.value;
        modifyTodo.notes = inputFieldNotes.value;
        modifyTodo.index = todoData.index;
        updateTodo(currentProject.index, modifyTodo);
        displayProjects(dummyData);
        todoModal.remove();
    };
    inputDiv.appendChild(inputButton);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.onclick = () => {
        todoModal.remove();
    };
    modalContent.appendChild(closeButton);

    // Clicking on 'todoModal' (which is any area outisde of the content box) will close the window
    window.onclick = (event) => {
        if (event.target == todoModal) {
            todoModal.remove();
        }
    };
};

const displayData = (todoNo) => {
    // Reset any open todo containers
    if (document.querySelector('.data-container')) {
        document.querySelector('.data-container').remove();
        document.querySelector('.current-card').classList.add('todo-card');
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
        currentTodoCard.classList.remove('todo-card');
        currentTodoCard.classList.add('current-card');

        const dataContainer = document.createElement('div');
        dataContainer.classList.add('data-container');
        currentTodoCard.appendChild(dataContainer);

        const currentData = dummyData[coordinates[0]].data[coordinates[1]];

        const todoDescription = document.createElement('div');
        todoDescription.textContent = currentData.desc;
        dataContainer.appendChild(todoDescription);

        const todoDate = document.createElement('div');
        todoDate.textContent = currentData.duedate;
        dataContainer.appendChild(todoDate);

        const todoNotes = document.createElement('div');
        todoNotes.textContent = currentData.notes;
        dataContainer.appendChild(todoNotes);

        const todoModify = document.createElement('button');
        todoModify.textContent = 'Edit..';
        todoModify.onclick = () => {
            modifyTodo(dummyData[coordinates[0]], currentData);
        };
        dataContainer.appendChild(todoModify);
    }
};

const createNewProject = () => {
    // close any open todos
    if (document.querySelector('.todo-container')) {
        document.querySelector('.todo-container').remove();
    }

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
            if (!inputField.value) {
                return;
            } else {
                const newProjectTitle = inputField.value;
                makeProject(newProjectTitle);
                displayProjects(dummyData);
                projectModal.remove();
            }
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
};

const createNewTodo = (projectNo) => {
    // close any open todo cards
    /*
    if (document.querySelector('.data-container')) {
        document.querySelector('.data-container').remove();
        document
            .querySelector('.current-card')
            .classList.remove('current-card');
    }
*/
    // Modal Creation
    const todoModal = document.createElement('div');
    todoModal.setAttribute('id', 'project-modal');
    document.body.appendChild(todoModal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    todoModal.appendChild(modalContent);

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('modal-input-div');
    modalContent.appendChild(inputDiv);

    const inputTitle = document.createElement('div');
    inputTitle.classList.add('modal-input-title');
    inputTitle.textContent = 'Name of new Todo: ';
    inputDiv.appendChild(inputTitle);

    const inputFieldTitle = document.createElement('input');
    inputFieldTitle.setAttribute('type', 'text');
    inputFieldTitle.classList.add('modal-input-field');
    inputDiv.appendChild(inputFieldTitle);
    inputFieldTitle.focus();

    const inputDesc = document.createElement('div');
    inputDesc.classList.add('modal-input-title');
    inputDesc.textContent = 'Description: ';
    inputDiv.appendChild(inputDesc);

    const inputFieldDesc = document.createElement('input');
    inputFieldDesc.setAttribute('type', 'text');
    inputFieldDesc.classList.add('modal-input-field');
    inputDiv.appendChild(inputFieldDesc);

    const inputDuedate = document.createElement('div');
    inputDuedate.classList.add('modal-input-title');
    inputDuedate.textContent = 'Due Date: ';
    inputDiv.appendChild(inputDuedate);

    const inputFieldDuedate = document.createElement('input');
    inputFieldDuedate.setAttribute('type', 'text');
    inputFieldDuedate.classList.add('modal-input-field');
    inputDiv.appendChild(inputFieldDuedate);

    const inputNotes = document.createElement('div');
    inputNotes.classList.add('modal-input-title');
    inputNotes.textContent = 'Notes: ';
    inputDiv.appendChild(inputNotes);

    const inputFieldNotes = document.createElement('input');
    inputFieldNotes.setAttribute('type', 'text');
    inputFieldNotes.classList.add('modal-input-field');
    inputDiv.appendChild(inputFieldNotes);

    const inputButton = document.createElement('button');
    inputButton.setAttribute('type', 'button');
    inputButton.classList.add('modal-submit-button');
    inputButton.textContent = 'Submit';
    inputButton.onclick = () => {
        // Gather data
        const newTodo = {};
        newTodo.name = inputFieldTitle.value;
        newTodo.desc = inputFieldDesc.value;
        newTodo.duedate = inputFieldDuedate.value;
        newTodo.notes = inputFieldNotes.value;
        makeTodo(projectNo, newTodo);
        displayProjects(dummyData);
        todoModal.remove();
    };
    inputDiv.appendChild(inputButton);

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.onclick = () => {
        todoModal.remove();
    };
    modalContent.appendChild(closeButton);

    // Clicking on 'todoModal' (which is any area outisde of the content box) will close the window
    window.onclick = (event) => {
        if (event.target == todoModal) {
            todoModal.remove();
        }
    };
};

// Start

displayProjects(dummyData);
