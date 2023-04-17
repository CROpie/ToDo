// Creates the outline of the page from a default/blank HTML document
const createPageLayout = () => {
    // returns a new element with id and optional text
    const createElementWithID = (idString, textString = '') => {
        const element = document.createElement('div');
        element.setAttribute('id', idString);
        element.textContent = textString;
        return element;
    };

    // creates all the elements and adds them to the blank html
    const createBasicDom = () => {
        const body = document.querySelector('body');
        const fullContainer = createElementWithID('full-container');
        body.appendChild(fullContainer);

        const menu = createElementWithID('menu');
        fullContainer.appendChild(menu);

        menu.appendChild(createElementWithID('logo', 'LOGO'));

        const dateContainer = createElementWithID('date-container');
        menu.appendChild(dateContainer);

        const all = createElementWithID('all-dates', 'All');
        all.classList.add('date-item');
        all.dataset.dateIndex = 'all';
        dateContainer.appendChild(all);

        const week = createElementWithID('week-dates', '7 days');
        week.classList.add('date-item');
        week.dataset.dateIndex = 'week';
        dateContainer.appendChild(week);

        const day = createElementWithID('day-dates', 'Today');
        day.classList.add('date-item');
        day.dataset.dateIndex = 'day';
        dateContainer.appendChild(day);

        const past = createElementWithID('day-dates', 'Past');
        past.classList.add('date-item');
        past.dataset.dateIndex = 'past';
        dateContainer.appendChild(past);

        const projectContainer = createElementWithID('project-container');
        menu.appendChild(projectContainer);

        const allProjects = createElementWithID('all-projects', 'All');
        allProjects.classList.add('project');
        allProjects.dataset.projIndex = 'all';
        projectContainer.appendChild(allProjects);

        const newProjectContainer = createElementWithID(
            'new-project-container'
        );
        menu.appendChild(newProjectContainer);

        const newProject = createElementWithID('new-project', 'New Project');
        newProject.classList.add('project');
        newProject.dataset.projIndex = 'new';
        newProjectContainer.appendChild(newProject);

        const display = createElementWithID('display');
        fullContainer.appendChild(display);

        display.appendChild(createElementWithID('header'));
    };
    return { createBasicDom };
};

const displayContent = () => {
    const resetTodo = () => {
        if (document.querySelector('#todo-container')) {
            document.querySelector('#todo-container').remove();
        }
        if (document.querySelector('#new-todo-container')) {
            document.querySelector('#new-todo-container').remove();
        }

        const newTodoContainer = document.createElement('div');
        newTodoContainer.setAttribute('id', 'todo-container');
        return newTodoContainer;
    };

    const makeProjectButton = (project) => {
        const projectButton = document.createElement('div');
        projectButton.textContent = project.name;
        projectButton.classList.add('project');
        projectButton.dataset.projIndex = project.index;
        return projectButton;
    };

    const prettyDate = (dateString) => {
        const splitString = dateString.split('-');
        const year = splitString[0].slice(2, 4);
        const monthCode = [
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        let month = splitString[1];
        month = monthCode[parseInt(month)];
        const day = splitString[2];
        const newString = `${day} ${month}\u00A0\u00A0\u00A0'${year}`;
        return newString;
    };

    const makeDelButton = (projIndex, todoIndex) => {
        const delButton = document.createElement('div');
        delButton.textContent = 'X';
        delButton.dataset.del = `${projIndex}-${todoIndex}`;
        delButton.classList.add('todo-del-button');
        return delButton;
    };

    const makeTodoDiv = (projIndex, todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.dataset.todoIndeces = `${projIndex}-${todo.index}`;
        todoDiv.classList.add('todo');

        const todoName = document.createElement('div');
        todoName.classList.add('todo-name');
        todoName.textContent = todo.name;
        todoDiv.appendChild(todoName);

        const todoDate = document.createElement('div');
        todoDate.classList.add('todo-date');
        const date = prettyDate(todo.duedate);
        todoDate.textContent = date;
        todoDiv.appendChild(todoDate);

        const delButton = makeDelButton(projIndex, todo.index);
        todoDiv.appendChild(delButton);

        return todoDiv;
    };

    const makeAddNewTodoButton = (projIndex) => {
        const newTodoButton = document.createElement('div');
        newTodoButton.dataset.todoIndeces = `${projIndex}-new`;
        newTodoButton.classList.add('todo');
        newTodoButton.setAttribute('id', 'new-todo');
        newTodoButton.textContent = 'New Todo';
        return newTodoButton;
    };

    const resetData = (currentTodo) => {
        // If a todo-tab is open, close it
        if (document.querySelector('.open-todo')) {
            document.querySelector('.open-todo').remove();
        }
        if (document.querySelector('.current-todo')) {
            document
                .querySelector('.current-todo')
                .classList.remove('current-todo');
        }

        currentTodo.classList.add('current-todo');
        const dataContainer = document.createElement('div');
        dataContainer.classList.add('open-todo');
        currentTodo.insertAdjacentElement('afterend', dataContainer);
        return dataContainer;
    };

    const makeEditButton = (splitIndex) => {
        const modifyButton = document.createElement('div');
        modifyButton.textContent = 'E';
        modifyButton.dataset.edit = `${splitIndex[0]}-${splitIndex[1]}`;
        modifyButton.classList.add('todo-edit-button');
        return modifyButton;
    };

    // A function to move today's date forward by length 'interval'
    // interval needs to be < 28 for this to consistently work
    // ie 7 days or 14 days would be fine
    const todayPlusInterval = (interval) => {
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        const int = interval - 1;
        const thirtyDayMonths = [4, 6, 9, 11];

        if (month == '02' && day >= 28 - int) {
            day = day + interval - 28;
            month = month + 1;
        } else if (thirtyDayMonths.includes(month) && day >= 30 - int) {
            day = day + interval - 30;
            month = month + 1;
        } else if (day >= 31 - int && month == '12') {
            day = day + interval - 31;
            month = 1;
            year = year + 1;
        } else if (day >= 30 - int) {
            day = day + interval - 31;
            month = month + 1;
        } else {
            day = day + interval;
        }

        const padMonth = month.toString().padStart(2, 0);
        const padDay = day.toString().padStart(2, 0);
        const newDate = `${year}-${padMonth}-${padDay}`;

        return newDate;
    };

    const displayData = (todo, splitIndex) => {
        // close and return if the selected todo is already displayed (ie toggle)
        const currentTodo = document.querySelector(
            `[data-todo-indeces="${splitIndex[0]}-${splitIndex[1]}"]`
        );

        if (currentTodo.classList.contains('current-todo')) {
            document.querySelector('.open-todo').remove();
            currentTodo.classList.remove('current-todo');
            return;
        }

        // make a new container for data and display it
        const dataContainer = resetData(currentTodo);
        const dataArea = document.createElement('div');
        dataArea.classList.add('open-todo-data');
        dataContainer.appendChild(dataArea);

        const dataDesc = document.createElement('div');
        dataDesc.classList.add('todo-data');
        dataDesc.textContent = todo.desc;
        dataArea.appendChild(dataDesc);

        const dataNotes = document.createElement('div');
        dataNotes.classList.add('todo-data');
        dataNotes.textContent = todo.notes;
        dataArea.appendChild(dataNotes);

        const modifyButton = makeEditButton(splitIndex);
        dataContainer.appendChild(modifyButton);
    };

    // sorting a single project by duedate
    // not necessary? But don't want to use sort functions on the userData list directly ..
    const sortProjectFunction = (project) => {
        const sortedProjectDataList = [];

        project.data.forEach((todo) => {
            const sortedUserDataEntry = {};
            sortedUserDataEntry.pName = project.name;
            sortedUserDataEntry.pIndex = project.index;

            sortedUserDataEntry.tName = todo.name;
            sortedUserDataEntry.desc = todo.desc;
            sortedUserDataEntry.duedate = todo.duedate;
            sortedUserDataEntry.notes = todo.notes;
            sortedUserDataEntry.tIndex = todo.index;

            sortedProjectDataList.push(sortedUserDataEntry);
        });
        const orderedData = sortedProjectDataList.sort((a, b) =>
            a.duedate > b.duedate ? 1 : -1
        );
        return orderedData;
    };

    // sorting todos by date
    // creates a new list with the data from userData, sorts it, then returns it
    // the new list is an array of todo objects, rather than an array of project objects
    const sortAllFunction = (userData) => {
        const sortedUserDataList = [];

        userData.forEach((project) => {
            project.data.forEach((todo) => {
                const sortedUserDataEntry = {};
                sortedUserDataEntry.pName = project.name;
                sortedUserDataEntry.pIndex = project.index;

                sortedUserDataEntry.tName = todo.name;
                sortedUserDataEntry.desc = todo.desc;
                sortedUserDataEntry.duedate = todo.duedate;
                sortedUserDataEntry.notes = todo.notes;
                sortedUserDataEntry.tIndex = todo.index;

                sortedUserDataList.push(sortedUserDataEntry);
            });
        });

        const orderedData = sortedUserDataList.sort((a, b) =>
            a.duedate > b.duedate ? 1 : -1
        );
        return orderedData;
    };

    const filterByDate = (sortedData, chosenDateSort) => {
        // get Today's date, and increment it if requred
        const today = todayPlusInterval(0);
        const oneWeek = todayPlusInterval(7);

        if (chosenDateSort === 'week') {
            sortedData = sortedData.filter((todo) => {
                if (todo.duedate < oneWeek && todo.duedate >= today) {
                    return true;
                }
            });
        } else if (chosenDateSort === 'day') {
            sortedData = sortedData.filter((todo) => {
                if (todo.duedate == today) {
                    return true;
                }
            });
        } else if (chosenDateSort === 'past') {
            sortedData = sortedData.filter((todo) => {
                if (todo.duedate < today) {
                    return true;
                }
            });
        }
        return sortedData;
    };

    const displayAllTodos = (userData) => {
        // create a fresh todoContainer div
        const newTodoContainer = resetTodo();
        document.querySelector('#display').appendChild(newTodoContainer);

        // the data from the sorted array is then inputted during forEach
        // userData isn't changed, and the forEach function has the appropriate references to it (tIndex, pIndex)
        // therefore nothing else needs to change
        // Probably more efficient to store a list of todos objects that have project info, rather than a list of project objects..
        let sortedData = sortAllFunction(userData);

        // filter function for how many days to display
        const chosenDateSort =
            document.querySelector('.selected-date').dataset.dateIndex;

        sortedData = filterByDate(sortedData, chosenDateSort);

        sortedData.forEach((sortedTodo) => {
            let todo = {};
            todo.name = sortedTodo.tName;
            todo.desc = sortedTodo.desc;
            todo.duedate = sortedTodo.duedate;
            todo.notes = sortedTodo.notes;
            todo.index = parseInt(sortedTodo.tIndex);
            const todoDiv = makeTodoDiv(sortedTodo.pIndex, todo);
            newTodoContainer.appendChild(todoDiv);
        });

        /*
        // Displaying unsorted (ie in the order added)
        userData.forEach((project) => {
            project.data.forEach((todo) => {
                const todoDiv = makeTodoDiv(project.index, todo);
                newTodoContainer.appendChild(todoDiv);
            });
        });
*/
        // Make a button for adding a new todo
        const newTodoButton = makeAddNewTodoButton('all');
        newTodoContainer.appendChild(newTodoButton);
    };

    const displayTodos = (project) => {
        // create a fresh todoContainer div
        const newTodoContainer = resetTodo();
        document.querySelector('#display').appendChild(newTodoContainer);

        sortedData = sortProjectFunction(project);

        // filter function for how many days to display
        const chosenDateSort =
            document.querySelector('.selected-date').dataset.dateIndex;

        sortedData = filterByDate(sortedData, chosenDateSort);

        sortedData.forEach((sortedTodo) => {
            let todo = {};
            todo.name = sortedTodo.tName;
            todo.desc = sortedTodo.desc;
            todo.duedate = sortedTodo.duedate;
            todo.notes = sortedTodo.notes;
            todo.index = parseInt(sortedTodo.tIndex);
            const todoDiv = makeTodoDiv(sortedTodo.pIndex, todo);
            newTodoContainer.appendChild(todoDiv);
        });

        /*
        // Displaying unsorted (ie in the order added)
        project.data.forEach((todo) => {
            const todoDiv = makeTodoDiv(project.index, todo);
            newTodoContainer.appendChild(todoDiv);
        });
        */

        // Make a button for adding a new todo
        const newTodoButton = makeAddNewTodoButton(project.index);
        newTodoContainer.appendChild(newTodoButton);
    };

    const displayProjects = (userData) => {
        // create a fresh projectContainer div
        const projectContainer = document.querySelector('#project-container');

        // Make a button for every project in the list
        userData.forEach((project) => {
            const projectButton = makeProjectButton(project);
            projectContainer.appendChild(projectButton);
        });
    };
    return { displayProjects, displayAllTodos, displayTodos, displayData };
};

// Produces modals specific for the reqquired action (login, new project, new todo, edit todo)
const inputInformation = () => {
    // Note: returns formContainer so that input fields can be easily added
    const createModal = () => {
        const projectModal = document.createElement('div');
        projectModal.setAttribute('id', 'modal-bg');
        document.body.appendChild(projectModal);

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        projectModal.appendChild(modalContent);

        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        modalContent.appendChild(formContainer);

        return formContainer;
    };

    // Will return one input field contianer with title and input field.
    // The parameter is the textContent of the title
    const modalInput = (text) => {
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

    const modalDate = (text) => {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('modal-input-div');

        const inputTitle = document.createElement('div');
        inputTitle.classList.add('modal-input-title');
        inputTitle.textContent = text;
        inputContainer.appendChild(inputTitle);

        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'date');
        inputField.classList.add('modal-input-field');
        inputContainer.appendChild(inputField);

        return inputContainer;
    };

    // Returns a button to allow for data submission
    const modalSubmitButton = () => {
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.classList.add('modal-submit-button');
        submitButton.textContent = 'Submit';
        return submitButton;
    };

    // Decided to not use, clicking outside the box will be sufficient
    const modalCloseButton = () => {
        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'X';
        return closeButton;
    };

    const modalDropdown = (projectList) => {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('modal-input-div');

        const inputTitle = document.createElement('div');
        inputTitle.classList.add('modal-input-title');
        inputTitle.textContent = 'Choose associated project';
        inputContainer.appendChild(inputTitle);

        const dropdown = document.createElement('select');
        dropdown.setAttribute('id', 'project-dropdown');
        dropdown.classList.add('modal-dropdown');
        projectList.forEach((project, index) => {
            const option = document.createElement('option');
            option.classList.add('dropdown-option');
            option.value = index;
            option.textContent = project;
            dropdown.appendChild(option);
        });
        inputContainer.appendChild(dropdown);
        return inputContainer;
    };

    const logInModal = () => {
        const formContainer = createModal();
        const inputNameContainer = modalInput('Username:');
        formContainer.appendChild(inputNameContainer);
    };

    const newProjectModal = () => {
        //resetPage();
        const formContainer = createModal();
        const inputNameContainer = modalInput('Name of new Project:');
        formContainer.appendChild(inputNameContainer);
    };

    const newTodoModal = (projIndex, projectList) => {
        const formContainer = createModal();

        const selectProjectDropdown = modalDropdown(projectList);
        formContainer.appendChild(selectProjectDropdown);

        if (projIndex !== 'all') {
            document.querySelector('#project-dropdown').selectedIndex =
                projIndex;
        }

        const inputNameContainer = modalInput('Name of new Todo: ');
        const inputDescContainer = modalInput('Description: ');
        const inputDateContainer = modalDate('Due Date: ');
        const inputNotesContainer = modalInput('Notes: ');
        const submitButton = modalSubmitButton();

        formContainer.appendChild(inputNameContainer);
        formContainer.appendChild(inputDescContainer);
        formContainer.appendChild(inputDateContainer);
        formContainer.appendChild(inputNotesContainer);

        formContainer.appendChild(submitButton);
    };

    const modifyTodoModal = (todoData, splitIndex, projectList) => {
        newTodoModal(splitIndex[0], projectList);
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

    return { logInModal, newProjectModal, newTodoModal, modifyTodoModal };
};

/*
// Start including default
const startProgram = (username) => {
    // Create a new localStorage if the username isn't recognized. 'Default' will load default data
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
}
*/

// Start including default
const userData = (username) => {
    // Create a new localStorage if the username isn't recognized. 'Default' will load default data
    if (!localStorage.getItem(username)) {
        console.log('creating new user..');
        let defaultData = [];
        const defaultJson = JSON.stringify(defaultData);
        localStorage.setItem(username, defaultJson);
    }

    const jsonData = localStorage.getItem(`${username}`);
    let userData = JSON.parse(jsonData);

    const displayUserProjects = () => {
        displayContent().displayProjects(userData);
    };

    const displayUserAllTodos = () => {
        displayContent().displayAllTodos(userData);
    };

    const displayUserTodos = (projIndex) => {
        displayContent().displayTodos(userData[projIndex]);
    };

    const displayUserData = (splitIndex) => {
        displayContent().displayData(
            userData[splitIndex[0]].data[splitIndex[1]],
            splitIndex
        );
    };

    const editTodoModal = (splitIndex) => {
        const projectList = [];
        userData.forEach((project) => {
            projectList.push(project.name);
        });
        inputInformation().modifyTodoModal(
            userData[splitIndex[0]].data[splitIndex[1]],
            splitIndex,
            projectList
        );
    };

    const newTodoModal = (projIndex) => {
        const projectList = [];
        userData.forEach((project) => {
            projectList.push(project.name);
        });
        inputInformation().newTodoModal(projIndex, projectList);
    };

    const removeTodo = (splitIndex) => {
        // remove one todo entry
        userData[splitIndex[0]].data.splice(splitIndex[1], 1);
        // re-allocate the indeces for todo.index
        userData[splitIndex[0]].data.forEach((todo, index) => {
            todo.index = index;
        });
        saveData(userData);
    };

    const editTodo = (splitIndex, selectedIndex, newTodo) => {
        // determine if the user wants to move the todo to a new project
        // same project, remove the current entry and add it to the same location
        if (splitIndex[0] == selectedIndex) {
            // keeps the same index
            newTodo.index = splitIndex[1];
            userData[splitIndex[0]].data.splice(splitIndex[1], 1, newTodo);
            // different project, so remove one entry, then add it to the correct project
        } else {
            // this removes an entry from a project. This means todo.index will no longer match the postition.
            userData[splitIndex[0]].data.splice([splitIndex[1]], 1);
            // need to re-alocate the indeces for todo.index
            userData[splitIndex[0]].data.forEach((todo, index) => {
                todo.index = index;
            });

            // find the new position for the todo in the other project
            newTodo.index = userData[selectedIndex].data.length;
            userData[selectedIndex].data.push(newTodo);
        }

        saveData(userData);
    };

    // Adds the new todo from newTodoModal into the array
    const newTodo = (projIndex, newTodo) => {
        newTodo.index = userData[projIndex].data.length;
        userData[projIndex].data.push(newTodo);
        saveData(userData);
    };

    // Adds the new project from inputInformation().newProjectModal into the array
    const newProject = (newProject) => {
        newProject.index = userData.length;
        userData.push(newProject);
        saveData(userData);
        return newProject.index;
    };

    const saveData = (userData) => {
        const tempJson = JSON.stringify(userData);
        localStorage.setItem(`${username}`, tempJson);
    };

    const consoleData = () => userData;

    return {
        displayUserProjects,
        displayUserAllTodos,
        displayUserTodos,
        displayUserData,
        newProject,
        removeTodo,
        editTodoModal,
        editTodo,
        newTodoModal,
        newTodo,
        consoleData,
    };
};

// adds eventListeners controls their actions
const userInterface = (username) => {
    const user = userData(username);

    const removeModal = () => {
        if (document.querySelector('#modal-bg')) {
            document.querySelector('#modal-bg').remove();
        }
        window.removeEventListener('click', removeModalWindow);
    };

    function removeModalWindow(event) {
        const projectModal = document.querySelector('#modal-bg');
        if (event.target == projectModal) {
            projectModal.remove();
            window.removeEventListener('click', removeModalWindow);
        }
    }

    // A function that essentially retrieves submitted form data
    // Either for new todos, or when editing one
    // projIndex is here as a parameter so that if it is 'all', all todos will be displayed after submission
    // (rather than just the project selected from the dropdown)
    // the parameter splitIndex is only used with modalType === 'edit'
    const obtainTodoModalData = (modalType, splitIndex) => {
        const tempTodo = [];
        document.querySelectorAll('.modal-input-field').forEach((field) => {
            if (!field.value) {
                // Stop the program somehow? Return doesn't exit the submitButton funcion..
            }
            tempTodo.push(field.value);
        });
        const newTodo = {};
        const newProjIndex =
            document.querySelector('.modal-dropdown').selectedIndex;
        newTodo.name = tempTodo[0];
        newTodo.desc = tempTodo[1];
        newTodo.duedate = tempTodo[2];
        newTodo.notes = tempTodo[3];
        //removeModal();
        // Depending on if the modal comes from newTodo or editTodo, the result is slightly different

        // Find out the current setting for displaying projects
        const projDisplayIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        const dateDisplayIndex =
            document.querySelector('.selected-date').dataset.dateIndex;

        if (modalType == 'new') {
            user.newTodo(newProjIndex, newTodo);
            refreshPage(projDisplayIndex, dateDisplayIndex);
        }

        if (modalType == 'edit') {
            user.editTodo(splitIndex, newProjIndex, newTodo);
            refreshPage(projDisplayIndex, dateDisplayIndex);
        }
    };

    // click functions: newTodo, newProject
    // the functions that operate when the corresponding button has been clicked

    // sets up a todo modal and an eventListener for the data submission button
    // projIndex will either be 'all' or the index of the project in the complete projectList
    const clickNewTodo = (projIndex) => {
        // need to collect the project list to add to a dropdown menu in the modal
        user.newTodoModal(projIndex);

        document.querySelector('.modal-input-field').focus();

        // Enable closing of the modal by clicking on an area outside
        window.addEventListener('click', removeModalWindow);

        document
            .querySelector('.modal-submit-button')
            .addEventListener('click', () => {
                obtainTodoModalData('new');
            });
    };

    const clickNewProject = () => {
        inputInformation().newProjectModal();
        const inputField = document.querySelector('.modal-input-field');
        inputField.focus();

        // Enable closing of the modal by clicking on an area outside
        window.addEventListener('click', removeModalWindow);

        // find the current date sort option
        const dateDisplayIndex =
            document.querySelector('.selected-date').dataset.dateIndex;

        // Retrieve the value after enter is pressed
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (!inputField.value) {
                    return;
                } else {
                    const newProject = {};
                    newProject.name = inputField.value;
                    newProject.data = [];
                    projIndex = user.newProject(newProject);
                    refreshPage(projIndex, dateDisplayIndex);
                }
            }
        });
    };

    // ClickHandler functions: edit todo, todo, project, date
    // They control what happens when a button is clicked by retrieving dataset values
    // The todoIndeces dataset is made up of two parts: project-todo

    // since there is only one option, didn't make a clickDel function
    const delClickHandler = (e) => {
        const todoIndeces = e.target.dataset.del;
        const splitIndex = todoIndeces.split('-');
        user.removeTodo(splitIndex);

        // Find the current date and project display options
        const projDisplayIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        const dateDisplayIndex =
            document.querySelector('.selected-date').dataset.dateIndex;
        refreshPage(projDisplayIndex, dateDisplayIndex);
    };

    // since there is only one option, didn't make a clickEdit function
    const editClickHandler = (e) => {
        const todoIndeces = e.target.dataset.edit;
        const splitIndex = todoIndeces.split('-');
        user.editTodoModal(splitIndex);

        window.addEventListener('click', removeModalWindow);

        document
            .querySelector('.modal-submit-button')
            .addEventListener('click', () => {
                obtainTodoModalData('edit', splitIndex);
            });
    };

    // todo may be 'new' or one of the named todo's
    const todoClickHandler = (e) => {
        const todoIndeces = e.target.dataset.todoIndeces;
        const splitIndex = todoIndeces.split('-');

        // either create a new todo, or display the data relevant to the clicked todo (and set up the edit button)
        if (splitIndex[1] === 'new') {
            console.log('creating new todo');
            clickNewTodo(splitIndex[0]);
        } else {
            user.displayUserData(splitIndex);
            // set up listeners for editing and deleting
            document
                .querySelector('.todo-edit-button')
                .addEventListener('click', editClickHandler);
        }
    };

    // Changes the highlighted project in the menu
    // The dataset dateIndex will become relevant when the page is refreshed
    const dateSelection = (dateDisplayIndex) => {
        document
            .querySelector('.selected-date')
            .classList.remove('selected-date');

        document
            .querySelector(`[data-date-index="${dateDisplayIndex}"]`)
            .classList.add('selected-date');
    };

    const dateClickHandler = (e) => {
        const dateDisplayIndex = e.target.dataset.dateIndex;
        dateSelection(dateDisplayIndex);

        const projDisplayIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        refreshPage(projDisplayIndex, dateDisplayIndex);
    };

    // Changes the highlighted project in the menu
    // The dataset selectIndex will become relevant when the page is refreshed
    // This will 'remember' which list of todos should be displayed
    const projectSelection = (projIndex) => {
        document
            .querySelector('.selected-project')
            .classList.remove('selected-project');

        document
            .querySelector(`[data-proj-index="${projIndex}"]`)
            .classList.add('selected-project');
    };

    const projectClickHandler = (e) => {
        const projIndex = e.target.dataset.projIndex;

        if (projIndex === 'new') {
            console.log('creating new project');
            clickNewProject();
        } else if (projIndex === 'all') {
            projectSelection(projIndex);
            user.displayUserAllTodos();

            document.querySelectorAll('.todo').forEach((button) => {
                button.addEventListener('click', todoClickHandler);
            });

            document.querySelectorAll('.todo-del-button').forEach((button) => {
                button.addEventListener('click', delClickHandler);
            });
        } else {
            projectSelection(projIndex);
            user.displayUserTodos(projIndex);

            document.querySelectorAll('.todo').forEach((button) => {
                button.addEventListener('click', todoClickHandler);
            });

            document.querySelectorAll('.todo-del-button').forEach((button) => {
                button.addEventListener('click', delClickHandler);
            });
        }
    };

    // loads the starting application screen
    const refreshPage = (projDisplayIndex, dateDisplayIndex) => {
        removeModal();
        document.querySelector('#full-container').remove();
        createPageLayout().createBasicDom();
        document.querySelector('#header').textContent = `Welcome, ${username}`;

        // Show display the projects in the user's database
        user.displayUserProjects();

        // Highlight the 'remembered' date selection option
        document
            .querySelector(`[data-date-index="${dateDisplayIndex}"]`)
            .classList.add('selected-date');

        // Highlight the 'remembered' project selection option
        document
            .querySelector(`[data-proj-index="${projDisplayIndex}"]`)
            .classList.add('selected-project');

        // Display the todos based on the filter options

        //    const dateSelectIndex =
        //document.querySelector('.selected-project').dataset.selectIndex;

        if (projDisplayIndex === 'all') {
            user.displayUserAllTodos();
        } else {
            user.displayUserTodos(projDisplayIndex);
        }

        // Add event listeners to the relevent buttons.

        // Projects (All, Named, New)
        document.querySelectorAll('.project').forEach((button) => {
            button.addEventListener('click', projectClickHandler);
        });

        // Date sorting functions (all, today, 7 days)
        document.querySelectorAll('.date-item').forEach((button) => {
            button.addEventListener('click', dateClickHandler);
        });

        // Todos (Named, New)
        // 'All' is selected when the program opens, so may be more than just New present
        document.querySelectorAll('.todo').forEach((button) => {
            button.addEventListener('click', todoClickHandler);
        });
        document.querySelectorAll('.todo-del-button').forEach((button) => {
            button.addEventListener('click', delClickHandler);
        });
    };

    // For the first load, show the todos from every project

    refreshPage('all', 'all');
};

const logIn = () => {
    // create and display modal
    inputInformation().logInModal();

    // add 'enter' eventListener
    const usernameInput = document.querySelector('.modal-input-field');
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            if (!usernameInput.value) {
                return;
            } else {
                userInterface(usernameInput.value);
            }
        }
    });
};

createPageLayout().createBasicDom();
logIn();
