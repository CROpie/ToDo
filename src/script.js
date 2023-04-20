const createDefaultData = () => {
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

    const saveDataSet = () => {
        fetch('./defaultData.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // want a date in the past, but if it is the 1st of the month, todayPlusInterval(-1) will not work properly
                // in this case, just remove a year from the current day.
                const checkToday = todayPlusInterval(0);
                if (checkToday.slice(8) === '01') {
                    let splitDate = checkToday.split('-');
                    const newDate = `${splitDate[0] - 1}-${splitDate[1]}-${
                        splitDate[2]
                    }`;
                    data[0].data[0].duedate = newDate;
                } else {
                    data[0].data[0].duedate = todayPlusInterval(-1);
                }
                data[0].data[1].duedate = todayPlusInterval(0);
                data[0].data[2].duedate = todayPlusInterval(1);
                data[0].data[3].duedate = todayPlusInterval(2);
                data[0].data[4].duedate = todayPlusInterval(14);
                data[1].data[0].duedate = todayPlusInterval(0);
                data[1].data[1].duedate = todayPlusInterval(0);
                data[1].data[2].duedate = todayPlusInterval(1);
                data[1].data[3].duedate = todayPlusInterval(1);
                data[1].data[4].duedate = todayPlusInterval(4);

                const defaultJson = JSON.stringify(data);
                localStorage.setItem('Default', defaultJson);
            });
    };

    return { saveDataSet };
};

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

        menu.appendChild(createElementWithID('logoDiv'));
        const bearLogo = document.createElement('img');
        bearLogo.classList.add('bearImage');
        bearLogo.src = './Images/BearbeerCrop.png';
        document.querySelector('#logoDiv').appendChild(bearLogo);
        const bearText = createElementWithID('bearText', 'Opie the Beer Bear');
        document.querySelector('#logoDiv').appendChild(bearText);

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
        const projectButtonContainer = document.createElement('div');
        projectButtonContainer.classList.add('proj-button-container');
        projectButtonContainer.dataset.projIndex = project.index;

        const projectButton = document.createElement('div');
        projectButton.textContent = project.name;
        projectButton.classList.add('project');
        projectButton.dataset.projIndex = project.index;
        projectButtonContainer.appendChild(projectButton);

        const delButton = document.createElement('div');
        delButton.textContent = 'X';
        delButton.dataset.projDel = project.index;
        delButton.classList.add('proj-del-button');
        projectButtonContainer.appendChild(delButton);

        return projectButtonContainer;
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

    const makeTodoDiv = (todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.dataset.projIndexTodoIndex = `${todo.projIndex}-${todo.index}`;
        todoDiv.classList.add('todo');

        const todoName = document.createElement('div');
        todoName.classList.add('todo-name');
        todoName.textContent = todo.name;
        todoDiv.appendChild(todoName);

        const todoDate = document.createElement('div');
        todoDate.classList.add('todo-date');

        if (todo.dateFlag == 'today') {
            todoDate.textContent = 'Today';
            todoDate.classList.add('date-today');
        } else if (todo.dateFlag == 'tommorrow') {
            todoDate.textContent = 'Tomorrow';
            todoDate.classList.add('date-tomorrow');
        } else if (todo.dateFlag == 'past') {
            todoDate.textContent = prettyDate(todo.duedate);
            todoDate.classList.add('date-past');
        } else {
            todoDate.textContent = prettyDate(todo.duedate);
        }
        todoDiv.appendChild(todoDate);

        const delButton = makeDelButton(todo.projIndex, todo.index);
        todoDiv.appendChild(delButton);

        return todoDiv;
    };

    const makeAddNewTodoButton = (projIndex) => {
        const newTodoButton = document.createElement('div');
        newTodoButton.dataset.projIndexTodoIndex = `${projIndex}-new`;
        newTodoButton.classList.add('todo');
        newTodoButton.setAttribute('id', 'new-todo');
        newTodoButton.textContent = 'New Todo';
        return newTodoButton;
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

    const resetOpenTodo = () => {
        // If a todo-tab is open, close it
        if (document.querySelector('.open-todo')) {
            document.querySelector('.open-todo').remove();
        }
        if (document.querySelector('.current-todo')) {
            document
                .querySelector('.current-todo')
                .classList.remove('current-todo');
        }
    };

    // If the current todo is open, close it. Return false to prevent the opening process
    const toggleOpenTodo = (currentTodo) => {
        if (currentTodo.classList.contains('current-todo')) {
            if (document.querySelector('.open-todo')) {
                document.querySelector('.open-todo').remove();
            }
            return false;
        } else {
            return true;
        }
    };

    const createElementWithClass = (className, text) => {
        const newElement = document.createElement('div');
        newElement.classList.add(className);
        newElement.textContent = text;
        return newElement;
    };

    const displayData = (todo, splitIndex) => {
        const currentTodo = document.querySelector(
            `[data-proj-index-todo-index="${splitIndex[0]}-${splitIndex[1]}"]`
        );

        // If the current todo is open, close it
        if (!toggleOpenTodo(currentTodo)) {
            currentTodo.classList.remove('current-todo');
            return;
        }
        // If a diffent todo is open, close it
        resetOpenTodo();

        currentTodo.classList.add('current-todo');

        const dataContainer = createElementWithClass('open-todo');
        currentTodo.insertAdjacentElement('afterend', dataContainer);

        const dataArea = createElementWithClass('open-todo-data');
        dataContainer.appendChild(dataArea);

        dataArea.appendChild(createElementWithClass('todo-data', todo.desc));
        dataArea.appendChild(createElementWithClass('todo-data', todo.notes));

        const modifyButton = createElementWithClass('todo-edit-button', 'E');
        modifyButton.dataset.edit = `${splitIndex[0]}-${splitIndex[1]}`;
        dataContainer.appendChild(modifyButton);
    };

    const makeDuplicateTodo = (todo, projIndex) => {
        const duplicateTodo = structuredClone(todo);
        duplicateTodo.projIndex = projIndex;

        return duplicateTodo;
    };

    // creates a new list with the data from userData
    // the new list is an array of todo objects, rather than an array of project objects
    // this allows sorting by date of todos from all projects combined
    const getTodoList = (userData, projSelected) => {
        const todoList = [];

        if (projSelected == 'all') {
            userData.forEach((project) => {
                project.data.forEach((todo) => {
                    todoList.push(makeDuplicateTodo(todo, project.index));
                });
            });
        } else {
            userData[projSelected].data.forEach((todo) => {
                todoList.push(makeDuplicateTodo(todo, projSelected));
            });
        }
        return todoList;
    };

    const filterByDate = (todoList, dateSelected) => {
        // get strings for today's date and a date a week from today
        const today = todayPlusInterval(0);
        const oneWeek = todayPlusInterval(7);

        if (dateSelected === 'week') {
            todoList = todoList.filter((todo) => {
                if (todo.duedate < oneWeek && todo.duedate >= today) {
                    return true;
                }
            });
        } else if (dateSelected === 'day') {
            todoList = todoList.filter((todo) => {
                if (todo.duedate == today) {
                    return true;
                }
            });
        } else if (dateSelected === 'past') {
            todoList = todoList.filter((todo) => {
                if (todo.duedate < today) {
                    return true;
                }
            });
        }
        return todoList;
    };

    const sortByDate = (todoList) => {
        todoList = todoList.sort((a, b) => (a.duedate > b.duedate ? 1 : -1));
        return todoList;
    };

    const flagDateColorCoding = (todoList) => {
        const dateToday = todayPlusInterval(0);
        const dateTomorrow = todayPlusInterval(1);

        todoList.forEach((todo) => {
            // Flag certain todo dates for text and colour alterations
            if (todo.duedate == dateToday) {
                todo.dateFlag = 'today';
            } else if (todo.duedate == dateTomorrow) {
                todo.dateFlag = 'tommorrow';
            } else if (todo.duedate < dateToday) {
                todo.dateFlag = 'past';
            }
        });
        return todoList;
    };

    const displayTodos = (projIndex, userData) => {
        /*
        // determine which projects are currently being displayed
        const projSelected =
            document.querySelector('.selected-project').dataset.projIndex;
        */

        // replicate todos in a new array (of todo objects) having the appropriate projIndex as an attribute
        // projSelected='all' will give an array of every todo, whereas projIndex='num' will just have the selected project todos
        let todoList = getTodoList(userData, projIndex);

        // determine which time period is currently being displayed
        const dateSelected =
            document.querySelector('.selected-date').dataset.dateIndex;

        // filter todoList by time period selected
        todoList = filterByDate(todoList, dateSelected);

        // sort remaining todoList by duedate
        todoList = sortByDate(todoList);

        // flag certain due-days for color-coding and special text
        todoList = flagDateColorCoding(todoList);

        // create a fresh #todo-container div
        const todoContainer = resetTodo();
        document.querySelector('#display').appendChild(todoContainer);

        // add todos to #todo-container
        todoList.forEach((todo) => {
            const todoDiv = makeTodoDiv(todo);
            todoContainer.appendChild(todoDiv);
        });

        // Make a button for adding a new todo
        const newTodoButton = makeAddNewTodoButton(projIndex);
        todoContainer.appendChild(newTodoButton);
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
    return { displayProjects, displayTodos, displayData };
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

// Start
const userData = (username) => {
    // Create a new localStorage if the username isn't recognized. 'Default' has been added already and will load default data
    if (!localStorage.getItem(username)) {
        console.log('creating new user..');
        let defaultData = [];
        const defaultJson = JSON.stringify(defaultData);
        localStorage.setItem(username, defaultJson);
    }

    const jsonData = localStorage.getItem(username);
    let userData = JSON.parse(jsonData);

    const displayUserProjects = () => {
        displayContent().displayProjects(userData);
    };

    const displayUserTodos = (projIndex) => {
        displayContent().displayTodos(projIndex, userData);
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

    const removeProject = (projIndex) => {
        // remove one project
        userData.splice(projIndex, 1);
        // re-allocate the indeces for project.index
        userData.forEach((project, index) => {
            project.index = index;
        });
        saveData(userData);
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

    const editTodo = (splitIndex, todoProjIndex, editTodo) => {
        // determine if the user wants to move the todo to a new project
        // same project, remove the current entry and add it to the same location
        if (splitIndex[0] == todoProjIndex) {
            // keeps the same index
            editTodo.index = splitIndex[1];
            userData[splitIndex[0]].data.splice(splitIndex[1], 1, editTodo);
            // different project, so remove one entry, then add it to the correct project
        } else {
            // this removes an entry from a project. This means todo.index will no longer match the postition.
            userData[splitIndex[0]].data.splice([splitIndex[1]], 1);
            // need to re-alocate the indeces for todo.index
            userData[splitIndex[0]].data.forEach((todo, index) => {
                todo.index = index;
            });

            // find the new position for the todo in the other project
            editTodo.index = userData[todoProjIndex].data.length;
            userData[todoProjIndex].data.push(editTodo);
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
        displayUserTodos,
        displayUserData,
        newProject,
        removeProject,
        removeTodo,
        editTodoModal,
        editTodo,
        newTodoModal,
        newTodo,
        consoleData,
    };
};

// adds eventListeners & control their actions
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
        const newTodo = {
            name: tempTodo[0],
            desc: tempTodo[1],
            duedate: tempTodo[2],
            notes: tempTodo[3],
        };

        // todos dont store the parent projIndex as an attribute, but need it for adding to the database
        // isn't necessarily the same as .selected-project, if the user changes the project in the dropdown menu
        const todoProjIndex =
            document.querySelector('.modal-dropdown').selectedIndex;

        // Find out the current settings for displaying projects
        const projIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        const dateIndex =
            document.querySelector('.selected-date').dataset.dateIndex;

        // Want to refresh the page to 'all' if selected, or the project of the new todo if 'all' isn't selected
        if (modalType == 'new') {
            user.newTodo(todoProjIndex, newTodo);

            if (projIndex === 'all') {
                refreshPage(projIndex, dateIndex);
            } else {
                refreshPage(todoProjIndex, dateIndex);
            }
        }

        if (modalType == 'edit') {
            user.editTodo(splitIndex, todoProjIndex, newTodo);

            if (projIndex === 'all') {
                refreshPage(projIndex, dateIndex);
            } else {
                refreshPage(todoProjIndex, dateIndex);
            }
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

        // Retrieve the value after enter is pressed
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (!inputField.value) {
                    return;
                } else {
                    const newProject = {
                        name: inputField.value,
                        data: [],
                    };
                    const projIndex = user.newProject(newProject);

                    // find the current date sort option
                    const dateIndex =
                        document.querySelector('.selected-date').dataset
                            .dateIndex;
                    refreshPage(projIndex, dateIndex);
                }
            }
        });
    };

    // ClickHandler functions: edit todo, todo, project, date
    // They control what happens when a button is clicked by retrieving dataset values
    // The projIndexTodoIndex dataset is made up of two indeces

    // since there is only one option, didn't make a clickDel function
    const todoDelClickHandler = (e) => {
        const projIndexTodoIndex = e.target.dataset.del;
        const splitIndex = projIndexTodoIndex.split('-');
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
        const projIndexTodoIndex = e.target.dataset.edit;
        const splitIndex = projIndexTodoIndex.split('-');
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
        const projIndexTodoIndex = e.target.dataset.projIndexTodoIndex;
        const splitIndex = projIndexTodoIndex.split('-');

        // either create a new todo, or display the data relevant to the clicked todo (and set up the edit button)
        if (splitIndex[1] === 'new') {
            console.log('creating new todo');
            clickNewTodo(splitIndex[0]);
        } else {
            user.displayUserData(splitIndex);
            // set up listener for editing
            document
                .querySelector('.todo-edit-button')
                .addEventListener('click', editClickHandler);
        }
    };

    // Changes the highlighted project in the menu
    // The dataset dateIndex will become relevant when the page is refreshed
    const dateSelection = (dateIndex) => {
        document
            .querySelector('.selected-date')
            .classList.remove('selected-date');

        document
            .querySelector(`[data-date-index="${dateIndex}"]`)
            .classList.add('selected-date');
    };

    const dateClickHandler = (e) => {
        const dateIndex = e.target.dataset.dateIndex;
        dateSelection(dateIndex);

        const projIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        refreshPage(projIndex, dateIndex);
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
        } else {
            projectSelection(projIndex);
            const dateIndex =
                document.querySelector('.selected-date').dataset.dateIndex;
            refreshPage(projIndex, dateIndex);
        }
    };

    const projectMouseOutHandler = (e) => {
        const projIndex = e.target.dataset.projIndex;
        const projDelButton = document.querySelector(
            `[data-proj-del="${projIndex}"]`
        );
        projDelButton.style.visibility = 'hidden';
    };

    const projectMouseInHandler = (e) => {
        // a TypeError: cannot read properties of null comes up when hovering over the X for some reason
        // try/catch makes it so the error doesn't display, doesn't effect the outcome of the function
        try {
            const projIndex = e.target.dataset.projIndex;
            const projDelButton = document.querySelector(
                `[data-proj-del="${projIndex}"]`
            );
            projDelButton.style.visibility = 'visible';
        } catch {}
    };

    const projectDelClickHandler = (e) => {
        const projIndex = e.target.dataset.projDel;
        user.removeProject(projIndex);

        // Find the current date display option

        const dateIndex =
            document.querySelector('.selected-date').dataset.dateIndex;
        refreshPage('all', dateIndex);
    };

    // loads the starting application screen
    const refreshPage = (projIndex, dateIndex) => {
        // if a modal is present, remove it
        removeModal();

        // re-create the home screen
        document.querySelector('#full-container').remove();
        createPageLayout().createBasicDom();

        document.querySelector('#header').textContent = `Welcome, ${username}`;

        // Display the projects in the user's database
        user.displayUserProjects();

        // Highlight the 'remembered' date selection option
        document
            .querySelector(`[data-date-index="${dateIndex}"]`)
            .classList.add('selected-date');

        // Highlight the 'remembered' project selection option
        document
            .querySelector(`[data-proj-index="${projIndex}"]`)
            .classList.add('selected-project');

        // Display whichever todos make it through the filter options
        user.displayUserTodos(projIndex);

        // Add event listeners to the relevent buttons.

        // Projects (All, Named, New)
        document.querySelectorAll('.project').forEach((button) => {
            button.addEventListener('click', projectClickHandler);
        });

        // Make the project delete buttons visible and invisible when the mouse goes over the relevant project
        document
            .querySelectorAll('.proj-button-container')
            .forEach((button) => {
                button.addEventListener('mouseover', projectMouseInHandler);
            });

        document
            .querySelectorAll('.proj-button-container')
            .forEach((button) => {
                button.addEventListener('mouseleave', projectMouseOutHandler);
            });

        // Project delete buttons
        document.querySelectorAll('.proj-del-button').forEach((button) => {
            button.addEventListener('click', projectDelClickHandler);
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
            button.addEventListener('click', todoDelClickHandler);
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
    usernameInput.focus();
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

createDefaultData().saveDataSet();
createPageLayout().createBasicDom();
logIn();
