// Creates a project list, populates it with projects populated with todos.
const dummyDataHandler = () => {
    const makeDummyTodo = (todoIndex) => {
        const newTodo = {};
        newTodo.name = `todo-${todoIndex}`;
        newTodo.desc = 'this is a description';
        newTodo.duedate = 'yyyy-mm-dd hh:mm';
        newTodo.notes = 'notes such as this';
        newTodo.index = todoIndex;
        return newTodo;
    };

    const makeDummyProject = (numTodos, projIndex) => {
        const newProject = {};
        newProject.name = `Project - ${projIndex}`;
        newProject.data = [];
        newProject.index = projIndex;
        for (let i = 0; i < numTodos; i++) {
            newProject.data.push(makeDummyTodo(i));
        }
        return newProject;
    };

    const makeDummyProjectList = (numProjects) => {
        const newProjectList = [];
        for (let i = 0; i < numProjects; i++) {
            newProjectList[i] = makeDummyProject(5, i);
        }
        return newProjectList;
    };

    return { makeDummyProjectList };
};

// Prints data to the console, rather than via HTML
const printContent = () => {
    const printProjects = (userData) => {
        userData.forEach((project) => {
            console.log(`name: ${project.name}`);
            console.log('......');
        });
    };

    const printTodos = (project) => {
        project.data.forEach((todo) => {
            console.log(`name: ${todo.name}`);
            console.log(`description: ${todo.desc}`);
            console.log(`duedate: ${todo.duedate}`);
            console.log(`notes: ${todo.notes}`);
            console.log('.....');
        });
    };

    return { printProjects, printTodos };
};

// Prints data via HTML
const displayContent = () => {
    const resetPage = () => {
        if ((projContainer = document.querySelector('#project-container'))) {
            projContainer.remove();
        }

        const projectContainer = document.createElement('div');
        projectContainer.setAttribute('id', 'project-container');
        document.body.appendChild(projectContainer);
        return projectContainer;
    };

    const makeProjectButton = (project) => {
        const projectButton = document.createElement('button');
        projectButton.textContent = project.name;
        projectButton.classList.add('project-button');
        projectButton.dataset.projIndex = project.index;
        return projectButton;
    };

    const makeAddNewProjectButton = () => {
        const newProject = document.createElement('button');
        newProject.textContent = 'Create New Project';
        newProject.classList.add('project-button');
        newProject.classList.add('new-project-button');
        newProject.dataset.projIndex = 'new';
        return newProject;
    };

    const displayProjects = (userData) => {
        // create a fresh projectContainer div
        const projectContainer = resetPage();

        // Make a button for every project in the list
        userData.forEach((project) => {
            const projectButton = makeProjectButton(project);
            projectContainer.appendChild(projectButton);
        });

        // Make a button for adding a new project
        const newProjectButton = makeAddNewProjectButton();
        projectContainer.appendChild(newProjectButton);
    };

    const resetTodo = (projIndex) => {
        // Change later to include toggle?
        if (document.querySelector('.todo-container')) {
            document.querySelector('.todo-container').remove();
        }

        const newTodoContainer = document.createElement('div');
        newTodoContainer.classList.add('todo-container');
        newTodoContainer.dataset.projectcontainer = projIndex;

        // locate the correct project (button), and put the todoContainer after it
        const currentProject = document.querySelector(
            `[data-proj-index="${projIndex}"]`
        );
        currentProject.insertAdjacentElement('afterend', newTodoContainer);
        return newTodoContainer;
    };

    const makeTodoCard = (projIndex, todo) => {
        const todoCard = document.createElement('div');
        todoCard.dataset.card = `${projIndex}-${todo.index}`;
        todoCard.classList.add('todo-card');
        todoCard.textContent = todo.name;
        return todoCard;
    };

    const makeAddNewTodoButton = (projIndex) => {
        const newTodoButton = document.createElement('div');
        newTodoButton.dataset.card = `${projIndex}-new`;
        newTodoButton.classList.add('todo-card');
        newTodoButton.textContent = 'Add New';
        return newTodoButton;
    };

    const displayTodos = (project) => {
        // create a fresh todoContainer div
        const newTodoContainer = resetTodo(project.index);

        project.data.forEach((todo) => {
            const todoCard = makeTodoCard(project.index, todo);
            newTodoContainer.appendChild(todoCard);
        });

        // Make a button for adding a new todo
        const newTodoButton = makeAddNewTodoButton(project.index);
        newTodoContainer.appendChild(newTodoButton);
    };

    const resetData = (indeces) => {
        // If a todo-tab is open, close it
        if ((dataContainer = document.querySelector('.data-container'))) {
            dataContainer.remove();
        }

        // Reset the class list to default
        if ((currentCard = document.querySelector('.current-card'))) {
            currentCard.classList.add('todo-card');
            currentCard.classList.remove('current-card');
        }

        // Locate the current card
        const currentTodoCard = document.querySelector(
            `[data-card="${indeces[0]}-${indeces[1]}"]`
        );

        // Toggle open and shut
        if (currentTodoCard.classList.contains('current-card')) {
            currentTodoCard.classList.remove('current-card');
        } else {
            // Open the card
            currentTodoCard.classList.remove('todo-card');
            currentTodoCard.classList.add('current-card');

            const dataContainer = document.createElement('div');
            dataContainer.classList.add('data-container');
            currentTodoCard.appendChild(dataContainer);

            return dataContainer;
        }
    };

    const makeEditButton = (indeces) => {
        const modifyButton = document.createElement('button');
        modifyButton.textContent = 'Edit..';
        modifyButton.dataset.edit = `${indeces[0]}-${indeces[1]}`;
        modifyButton.classList.add('todo-edit-button');
        return modifyButton;
    };

    const displayData = (todo, indeces) => {
        const dataContainer = resetData(indeces);
        let dataFields = [];
        for (let i = 0; i < 3; i++) {
            dataFields[i] = document.createElement('div');
            dataContainer.appendChild(dataFields[i]);
        }
        dataFields[0].textContent = todo.desc;
        dataFields[1].textContent = todo.duedate;
        dataFields[2].textContent = todo.notes;

        const modifyButton = makeEditButton(indeces);
        dataContainer.appendChild(modifyButton);
    };

    return { displayProjects, displayTodos, displayData };
};

// Allows inputting of new data
const inputInformation = () => {
    const resetPage = () => {
        // close any open todos
        if ((todoContainer = document.querySelector('.todo-container'))) {
            todoContainer.remove();
        }
    };

    // Note: returns formContainer so that input fields can be easily added
    const createModal = () => {
        const projectModal = document.createElement('div');
        projectModal.setAttribute('id', 'project-modal');
        document.body.appendChild(projectModal);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        projectModal.appendChild(modalContent);

        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        modalContent.appendChild(formContainer);

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'X';
        modalContent.appendChild(closeButton);

        return formContainer;
    };

    const modalInput = (text) => {
        // 3 stages: 1 container, 1 title, 1 entry field
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('modal-input-div');

        const inputTitle = document.createElement('div');
        inputTitle.classList.add('modal-input-title');
        inputTitle.textContent = text;
        inputContainer.appendChild(inputTitle);

        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'text');
        inputField.classList.add('modal-input-field');
        inputContainer.appendChild(inputField);

        return inputContainer;
    };

    const modalSubmitButton = () => {
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.classList.add('modal-submit-button');
        submitButton.textContent = 'Submit';
        return submitButton;
    };

    const createNewProject = () => {
        resetPage();
        const formContainer = createModal();

        const inputNameContainer = modalInput('Name of new Project:');

        formContainer.appendChild(inputNameContainer);
    };

    const createNewTodo = () => {
        const formContainer = createModal();
        const submitButton = modalSubmitButton();

        const inputNameContainer = modalInput('Name of new Todo: ');
        const inputDescContainer = modalInput('Description: ');
        const inputDateContainer = modalInput('Due Date: ');
        const inputNotesContainer = modalInput('Notes: ');

        formContainer.appendChild(inputNameContainer);
        formContainer.appendChild(inputDescContainer);
        formContainer.appendChild(inputDateContainer);
        formContainer.appendChild(inputNotesContainer);
        formContainer.appendChild(submitButton);
    };

    const modifyTodo = (todoData) => {
        createNewTodo();
        // populate the fields with the existing data
        const inputFields = [];
        document
            .querySelectorAll('.modal-input-field')
            .forEach((inputField) => {
                inputFields.push(inputField);
            });

        inputFields[0].value = todoData.name;
        inputFields[1].value = todoData.desc;
        inputFields[2].value = todoData.duedate;
        inputFields[3].value = todoData.notes;
    };

    return { createNewProject, createNewTodo, modifyTodo };
};

// Start
const startProgram = (username) => {
    // Create a new localStorage if the username isn't recognized
    if (!localStorage.getItem(username)) {
        if (username === 'default') {
            console.log('creating default');
            let defaultData = dummyDataHandler().makeDummyProjectList(3);
            const defaultJson = JSON.stringify(defaultData);
            localStorage.setItem(username, defaultJson);
        } else {
            console.log('creating new user..');
            let defaultData = [];
            const defaultJson = JSON.stringify(defaultData);
            localStorage.setItem(username, defaultJson);
        }
    }

    const jsonData = localStorage.getItem(`${username}`);
    let userData = JSON.parse(jsonData);

    const addDummyData = () => {
        userData = dummyDataHandler().makeDummyProjectList(3);
    };

    const printUserProjects = () => {
        printContent().printProjects(userData);
    };

    const printProjectTodos = (projIndex) => {
        printContent().printTodos(userData[projIndex]);
    };

    const displayUserProjects = () => {
        displayContent().displayProjects(userData);
    };

    const displayUserTodos = (projIndex) => {
        displayContent().displayTodos(userData[projIndex]);
    };

    const displayUserData = (indeces) => {
        displayContent().displayData(
            userData[indeces[0]].data[indeces[1]],
            indeces
        );
    };

    // Allows inputting of a new project name
    const newProjectModal = () => {
        inputInformation().createNewProject();
    };

    // Adds the new project from newProjectModal into the array
    const newProject = (newProject) => {
        newProject.index = userData.length;
        userData.push(newProject);
        saveData(userData);
    };

    const newTodoModal = () => {
        inputInformation().createNewTodo();
    };

    // Adds the new todo from newTodoModal into the array
    const newTodo = (projIndex, newTodo) => {
        newTodo.index = userData[projIndex].data.length;
        userData[projIndex].data.push(newTodo);
        saveData(userData);
    };

    // Send the exact data set to inputInformation in order to display it before modification
    const editTodoModal = (indeces) => {
        inputInformation().modifyTodo(userData[indeces[0]].data[indeces[1]]);
    };

    const editTodo = (indeces, newTodo) => {
        newTodo.index = indeces[1];
        userData[indeces[0]].data.splice(indeces[1], 1, newTodo);
        saveData(userData);
    };

    const saveData = (userData) => {
        const tempJson = JSON.stringify(userData);
        localStorage.setItem(`${username}`, tempJson);
    };

    const projectList = () => userData;

    return {
        addDummyData,

        printUserProjects,
        printProjectTodos,

        displayUserProjects,
        displayUserTodos,
        displayUserData,

        newProjectModal,
        newProject,
        newTodoModal,
        newTodo,
        editTodoModal,
        editTodo,

        projectList,
    };
};

// Event listeners and their actions.
// Identifies clicked item, sends it to startProgram where it is combined with the user's data and sent elsewhere to get processed
const userInterface = (username) => {
    const user = startProgram(username);

    const removeModal = () => {
        document.querySelector('#project-modal').remove();
        window.removeEventListener('click', removeModalWindow);
    };
    function removeModalWindow(event) {
        const projectModal = document.querySelector('#project-modal');
        if (event.target == projectModal) {
            projectModal.remove();
            window.removeEventListener('click', removeModalWindow);
        }
    }

    const obtainTodoModalData = (modalType, indexValue) => {
        const tempTodo = [];
        document.querySelectorAll('.modal-input-field').forEach((field) => {
            if (!field.value) {
                // Stop the program somehow? Return doesn't exit the submitButton funcion..
            }
            tempTodo.push(field.value);
        });
        const newTodo = {};
        newTodo.name = tempTodo[0];
        newTodo.desc = tempTodo[1];
        newTodo.duedate = tempTodo[2];
        newTodo.notes = tempTodo[3];
        removeModal();
        // Depending on if the modal comes from newTodo or editTodo, the result is slightly different
        if (modalType == 'new') {
            const projIndex = indexValue;
            user.newTodo(projIndex, newTodo);
            user.displayUserTodos(projIndex);
        }

        if (modalType == 'edit') {
            const indeces = indexValue;
            user.editTodo(indeces, newTodo);
            user.displayUserTodos(indeces[0]);
        }
        document.querySelectorAll('.todo-card').forEach((button) => {
            button.addEventListener('click', todoClickHandler);
        });
    };

    const clickNewTodo = (projIndex) => {
        user.newTodoModal();
        document.querySelector('.modal-input-field').focus();

        // Enable closing of the modal by X button or clicking on an area outside
        // can't seem to get {once: true} working, so need to use an additional function
        document
            .querySelector('.close-button')
            .addEventListener('click', removeModal);
        window.addEventListener('click', removeModalWindow);

        document
            .querySelector('.modal-submit-button')
            .addEventListener('click', () => {
                obtainTodoModalData('new', projIndex);
            });
    };

    const clickNewProject = () => {
        user.newProjectModal();
        const inputField = document.querySelector('.modal-input-field');
        inputField.focus();

        document
            .querySelector('.close-button')
            .addEventListener('click', removeModal);
        window.addEventListener('click', removeModalWindow);

        // Retrieve the value after enter is pressed
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (!inputField.value) {
                    return;
                } else {
                    const newProject = {};
                    newProject.name = inputField.value;
                    newProject.data = [];
                    removeModal();
                    user.newProject(newProject);
                    refreshPage();
                }
            }
        });
    };

    const projectClickHandler = (e) => {
        const projIndex = e.target.dataset.projIndex;

        if (projIndex === 'new') {
            clickNewProject();
        } else {
            user.displayUserTodos(projIndex);
            document.querySelectorAll('.todo-card').forEach((button) => {
                button.addEventListener('click', todoClickHandler);
            });
        }
    };

    // since there is only one option, didn't make a clickEdit function
    const editClickHandler = (e) => {
        const todoCardDataset = e.target.dataset.edit;
        const indeces = todoCardDataset.split('-');
        user.editTodoModal(indeces);

        document
            .querySelector('.close-button')
            .addEventListener('click', removeModal);
        window.addEventListener('click', removeModalWindow);

        document
            .querySelector('.modal-submit-button')
            .addEventListener('click', () => {
                obtainTodoModalData('edit', indeces);
            });
    };

    const todoClickHandler = (e) => {
        // retrieve dataset.card which is 'projectIndex-todoIndex'
        const todoCardDataset = e.target.dataset.card;
        try {
            todoCardDataset.split('-');
        } catch (err) {
            // an open todo has a data-container div that overlaps with todo-card
            // if it is pressed, .split won't work because it data-conatiner doesn't have a data-card property
            return;
        }
        const indeces = todoCardDataset.split('-');

        if (indeces[1] === 'new') {
            clickNewTodo(indeces[0]);
        } else {
            // projectIndex, todoIndex
            user.displayUserData(indeces);
            // set up listener for editing
            document
                .querySelector('.todo-edit-button')
                .addEventListener('click', editClickHandler);
        }
    };

    const refreshPage = () => {
        user.displayUserProjects();
        document.querySelectorAll('.project-button').forEach((button) => {
            button.addEventListener('click', projectClickHandler);
        });
    };

    refreshPage();
};

const logIn = () => {
    // bring up modal
    const testInput = document.createElement('input');
    testInput.setAttribute('type', 'text');
    document.body.appendChild(testInput);

    // add 'enter' eventListener
    testInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            if (!testInput.value) {
                return;
            } else {
                userInterface(testInput.value);
            }
        }
    });
};

logIn();
