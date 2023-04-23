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
        delButton.textContent = '✘';
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
        delButton.textContent = '✘';
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
        } else if (todo.dateFlag == 'dayaftertomorrow') {
            todoDate.textContent = 'Day after tomorrow';
            todoDate.classList.add('date-day-after-tomorrow');
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
        const dateDayAfterTomorrow = todayPlusInterval(2);

        todoList.forEach((todo) => {
            // Flag certain todo dates for text and colour alterations
            if (todo.duedate == dateToday) {
                todo.dateFlag = 'today';
            } else if (todo.duedate == dateTomorrow) {
                todo.dateFlag = 'tommorrow';
            } else if (todo.duedate == dateDayAfterTomorrow) {
                todo.dateFlag = 'dayaftertomorrow';
            } else if (todo.duedate < dateToday) {
                todo.dateFlag = 'past';
            }
        });
        return todoList;
    };

    const makeAddNewTodoButton = (projIndex) => {
        const todoDiv = document.createElement('div');
        todoDiv.dataset.projIndexTodoIndex = `${projIndex}-new`;
        todoDiv.classList.add('todo');
        todoDiv.setAttribute('id', 'new-todo');

        const todoName = document.createElement('div');
        todoName.classList.add('todo-name');
        todoName.textContent = 'New Todo';
        todoDiv.appendChild(todoName);

        // this div is just used to ensure the same spacing as a regular todo panel
        const todoDate = document.createElement('div');
        todoDate.classList.add('todo-date');
        todoDiv.appendChild(todoDate);

        return todoDiv;
    };

    const makeEditTodoButton = (splitIndex, todoData) => {
        const todoDiv = document.createElement('div');
        todoDiv.dataset.projIndexTodoIndex = `${splitIndex[0]}-${splitIndex[1]}`;
        todoDiv.classList.add('todo');
        todoDiv.setAttribute('id', 'edit-todo');

        const todoName = document.createElement('div');
        todoName.classList.add('todo-name');
        todoName.textContent = todoData.name;
        todoDiv.appendChild(todoName);

        const todoDate = document.createElement('div');
        todoDate.classList.add('todo-date');
        todoDiv.appendChild(todoDate);

        return todoDiv;
    };

    const displayTodos = (projIndex, userData) => {
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

        // Make a button for adding a new todo
        const newTodoButton = makeAddNewTodoButton(projIndex);
        todoContainer.appendChild(newTodoButton);

        // add todos to #todo-container
        todoList.forEach((todo) => {
            const todoDiv = makeTodoDiv(todo);
            todoContainer.appendChild(todoDiv);
        });
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
    return {
        displayProjects,
        displayTodos,
        displayData,
        makeProjectButton,
        resetOpenTodo,
        createElementWithClass,
        makeAddNewTodoButton,
        makeEditTodoButton,
    };
};

// Produces a modal for logging in, as well as modifying the home page to allow for direct addition/editing of data
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

    const inputDate = () => {
        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'date');
        inputField.setAttribute('id', 'date-input-field');
        inputField.classList.add('todo-input-field');
        inputField.addEventListener('change', () => {
            inputField.dataset.chosen = inputField.value;
        });

        return inputField;
    };

    const inputDropdown = (type, projectList) => {
        const dropdown = document.createElement('select');

        if (type === 'new') {
            dropdown.setAttribute('id', 'project-dropdown');
            dropdown.addEventListener('change', () => {
                dropdown.dataset.chosen = dropdown.value;
            });
            //dropdown.dataset.chosen = this.value;
            dropdown.required = true; // necessary for displaying the css properly (greyed out unable to select the first option)

            let option = document.createElement('option');
            option.classList.add('dropdown-option');
            option.value = '';
            option.textContent = 'Choose project: ';
            option.selected = true;
            option.disabled = true;

            dropdown.appendChild(option);
            projectList.forEach((project, index) => {
                const option = document.createElement('option');
                option.classList.add('dropdown-option');
                option.value = index;
                option.textContent = project;
                dropdown.appendChild(option);
            });
        } else if (type === 'edit') {
            dropdown.setAttribute('id', 'edit-project-dropdown');
            projectList.forEach((project, index) => {
                const option = document.createElement('option');
                option.classList.add('dropdown-option');
                option.value = index;
                option.textContent = project;
                dropdown.appendChild(option);
            });
        }
        return dropdown;
    };

    const logInModal = () => {
        const formContainer = createModal();
        const inputNameContainer = modalInput('Username:');
        formContainer.appendChild(inputNameContainer);
        const noteText = document.createElement('div');
        noteText.textContent =
            "Note: enter 'Default' to generate date-relevent sample data.";
        noteText.classList.add('login-note');
        formContainer.appendChild(noteText);
    };

    const inputProjectField = () => {
        const projectButtonContainer = document.createElement('div');
        projectButtonContainer.classList.add('proj-button-container');

        const projectButton = document.createElement('div');
        projectButton.contentEditable = 'true';
        projectButton.dataset.placeholder = 'Project Name:';
        projectButton.classList.add('proj-input-field');
        projectButtonContainer.appendChild(projectButton);

        return projectButtonContainer;
    };

    const newProjectEnhanced = () => {
        const projContainer = document.querySelector('#project-container');
        const blankProject = inputProjectField();
        projContainer.appendChild(blankProject);
    };

    const newTodoEnhanced = (projIndex, projectList) => {
        document.querySelector('#new-todo').remove();
        const todoContainer = document.querySelector('#todo-container');
        const currentTodo = displayContent().makeAddNewTodoButton(projIndex);
        currentTodo.classList.add('input-new-container');
        todoContainer.prepend(currentTodo);

        const todoDate = inputDate();
        currentTodo.appendChild(todoDate);

        // If a todo is open, close it
        displayContent().resetOpenTodo();

        const inputContainer =
            displayContent().createElementWithClass('open-todo');
        currentTodo.insertAdjacentElement('afterend', inputContainer);

        const inputArea =
            displayContent().createElementWithClass('open-todo-data');
        inputContainer.appendChild(inputArea);

        inputArea.appendChild(
            displayContent().createElementWithClass('todo-desc', 'Insert data')
        );
        inputArea.appendChild(
            displayContent().createElementWithClass(
                'todo-notes',
                'Insert notes'
            )
        );

        const todoName = document.querySelector('.todo-name');
        const todoDesc = document.querySelector('.todo-desc');
        const todoNotes = document.querySelector('.todo-notes');

        // adding temp classes for use obtaining the data after the submit button is pressed
        todoName.classList.add('submit-todo-name');
        todoDesc.classList.add('submit-todo-desc');
        todoNotes.classList.add('submit-todo-notes');
        todoDate.classList.add('submit-todo-duedate');

        const inputFields = [todoName, todoDesc, todoNotes];
        inputFields.forEach((field) => {
            field.classList.add('todo-input-field');
            field.contentEditable = 'true';
            field.textContent = '';
        });
        todoName.dataset.placeholder = 'New Todo';
        todoDesc.dataset.placeholder = 'Description:';
        todoNotes.dataset.placeholder = 'Notes';
        todoName.focus();

        const submitButton = displayContent().createElementWithClass(
            'todo-submit-button',
            '✔'
        );

        inputContainer.appendChild(submitButton);

        const selectProjectDropdown = inputDropdown('new', projectList);

        // since displayProjIndex is block scoped in userInterface(), there is no way to access it.
        // A workaround to see the current selected project is through the dom
        const displayProjIndex =
            document.querySelector('.selected-project').dataset.projIndex;

        // If currently displaying todos from a specific project, that project should be automatically loaded on the 'new todo' screen.
        if (displayProjIndex !== 'all') {
            selectProjectDropdown.selectedIndex =
                parseInt(displayProjIndex) + 1;
        }
        inputArea.appendChild(selectProjectDropdown);
    };

    const editTodoEnhanced = (todoData, splitIndex, projectList) => {
        const currentTodo = document.querySelector('.current-todo');
        const openTodoData = document.querySelector('.open-todo-data');
        const editableTodo = displayContent().makeEditTodoButton(
            splitIndex,
            todoData
        );

        editableTodo.classList.add('input-edit-container');
        currentTodo.insertAdjacentElement('afterend', editableTodo);
        currentTodo.remove();
        const todoDate = inputDate();
        todoDate.classList.add('todo-edit-field');
        editableTodo.appendChild(todoDate);
        todoDate.value = todoData.duedate;

        const todoName = editableTodo.childNodes[0];
        todoName.classList.add('submit-todo-name');
        const todoDesc = openTodoData.childNodes[0];
        todoDesc.classList.add('submit-todo-desc');
        const todoNotes = openTodoData.childNodes[1];
        todoNotes.classList.add('submit-todo-notes');
        todoDate.classList.add('submit-todo-duedate');

        const inputFields = [todoName, todoDesc, todoNotes];

        inputFields.forEach((field) => {
            field.classList.add('todo-edit-field');
            field.contentEditable = 'true';
        });

        const editButton = document.querySelector('.todo-edit-button');
        const submitButton = displayContent().createElementWithClass(
            'todo-submit-button',
            '✔'
        );
        editButton.insertAdjacentElement('afterend', submitButton);
        editButton.remove();

        const selectProjectDropdown = inputDropdown('edit', projectList);
        openTodoData.appendChild(selectProjectDropdown);
        selectProjectDropdown.selectedIndex = splitIndex[0];
    };

    return {
        logInModal,
        newTodoEnhanced,
        editTodoEnhanced,
        newProjectEnhanced,
    };
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

    const editTodoOpenStyle = (splitIndex) => {
        const projectList = [];
        userData.forEach((project) => {
            projectList.push(project.name);
        });
        inputInformation().editTodoEnhanced(
            userData[splitIndex[0]].data[splitIndex[1]],
            splitIndex,
            projectList
        );
    };

    const newTodoOpenStyle = (projIndex) => {
        const projectList = [];
        userData.forEach((project) => {
            projectList.push(project.name);
        });
        inputInformation().newTodoEnhanced(projIndex, projectList);
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

    // Modifies a todo from inputInformation().editTodoEnhanced the array
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
        // return the updated splitIndex
        splitIndex[0] = todoProjIndex;
        splitIndex[1] = editTodo.index;
        return splitIndex;
    };

    // Adds the new todo from inputInformation().newTodoEnhanced the array
    const newTodo = (projIndex, newTodo) => {
        newTodo.index = userData[projIndex].data.length;
        userData[projIndex].data.push(newTodo);
        saveData(userData);
    };

    // Adds the new project from inputInformation().newProjectEnhanced into the array
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
        editTodoOpenStyle,
        editTodo,
        newTodoOpenStyle,
        newTodo,
        consoleData,
    };
};

// adds eventListeners & control their actions
const userInterface = (username) => {
    const user = userData(username);

    // Two variables that store which display settings the user has chosen
    let displayProjIndex = 'all';
    let displayDateIndex = 'all';

    const removeModal = () => {
        if (document.querySelector('#modal-bg')) {
            document.querySelector('#modal-bg').remove();
        }
    };

    // A function that essentially retrieves submitted form data
    // Either for new todos, or when editing one
    // projIndex is here as a parameter so that if it is 'all', all todos will be displayed after submission
    // (rather than just the project selected from the dropdown)
    // the parameter splitIndex is only used with inputType === 'edit'
    const obtainTodoData = (inputType, splitIndex) => {
        const newTodo = {
            name: document.querySelector('.submit-todo-name').textContent,
            duedate: document.querySelector('.submit-todo-duedate').value,
            desc: document.querySelector('.submit-todo-desc').textContent,
            notes: document.querySelector('.submit-todo-notes').textContent,
        };

        // todos dont store the parent projIndex as an attribute, but need it for adding to the database
        // isn't necessarily the same as .selected-project, if the user changes the project in the dropdown menu
        // need to subtract 1 since 'Choose project: ' is index 0
        let todoProjIndex = 0;
        if (inputType === 'new') {
            todoProjIndex =
                document.querySelector('#project-dropdown').selectedIndex - 1;
        } else if (inputType === 'edit') {
            todoProjIndex = document.querySelector(
                '#edit-project-dropdown'
            ).selectedIndex;
        }

        // quick check to make sure the 3 required fields have values
        if (!newTodo.name) {
            alert('Please type in a name for the todo');
            return;
        }
        if (!newTodo.duedate) {
            alert('Please select a date.');
            return;
        }
        if (todoProjIndex === -1) {
            alert('Please choose a project grouping');
            return;
        }

        // Find out the current settings for displaying projects
        /*
        const projIndex =
            document.querySelector('.selected-project').dataset.projIndex;
        const dateIndex =
            document.querySelector('.selected-date').dataset.dateIndex;
            */

        // Want to refresh the page to 'all' if selected, or the project of the new todo if 'all' isn't selected
        if (inputType === 'new') {
            user.newTodo(todoProjIndex, newTodo);

            if (displayProjIndex === 'all') {
                refreshPage(displayProjIndex, displayDateIndex);
            } else {
                refreshPage(todoProjIndex, displayDateIndex);
            }
        }

        if (inputType === 'edit') {
            splitIndex = user.editTodo(splitIndex, todoProjIndex, newTodo);

            if (displayProjIndex === 'all') {
                refreshPage(
                    displayProjIndex,
                    displayDateIndex,
                    'edit',
                    splitIndex
                );
            } else {
                refreshPage(
                    todoProjIndex,
                    displayDateIndex,
                    'edit',
                    splitIndex
                );
            }
        }
    };

    // click functions: newTodo, newProject
    // the functions that operate when the corresponding button has been clicked

    // sets up input fields and initializes a submit data button
    // projIndex will either be 'all' or the index of the project in the complete projectList
    const clickNewTodo = (projIndex) => {
        // need to collect the project list to add to a dropdown menu
        user.newTodoOpenStyle(projIndex);

        document.querySelector('.todo-input-field').focus();

        document
            .querySelector('.todo-submit-button')
            .addEventListener('click', () => {
                obtainTodoData('new');
            });
    };

    const getProjectName = () => {
        const projInputField = document.querySelector('.proj-input-field');

        if (!projInputField.textContent) {
            projInputField.remove();
        } else {
            const newProject = {
                name: projInputField.textContent,
                data: [],
            };
            const projIndex = user.newProject(newProject);

            // uses projIndex instead of displayProjIndex to automatically display the newly created project
            refreshPage(projIndex, displayDateIndex);
        }
        window.removeEventListener('mouseup', getProjectName);
    };

    const clickNewProject = () => {
        inputInformation().newProjectEnhanced();

        const inputField = document.querySelector('.proj-input-field');
        inputField.focus();

        // if the window listener is 'click', it will trigger when clickNewProject itself is triggered
        window.addEventListener('mouseup', getProjectName);

        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                getProjectName();
            }
        });
    };

    const resetNewTodo = () => {
        if (!document.querySelector('.input-new-container')) {
            return;
        } else {
            refreshPage(displayProjIndex, displayDateIndex);
        }
    };

    const resetEditTodo = () => {
        if (!document.querySelector('.input-edit-container')) {
            return;
        } else {
            refreshPage(displayProjIndex, displayDateIndex);
        }
    };

    // ClickHandler functions: edit todo, todo, project, date
    // They control what happens when a button is clicked by retrieving dataset values
    // The projIndexTodoIndex dataset is made up of two indeces

    // since there is only one option, didn't make a clickDel function
    const todoDelClickHandler = (e) => {
        const projIndexTodoIndex = e.target.dataset.del;
        const splitIndex = projIndexTodoIndex.split('-');
        user.removeTodo(splitIndex);

        refreshPage(displayProjIndex, displayDateIndex);
    };

    // since there is only one option, didn't make a clickEdit function
    const editClickHandler = (e) => {
        const projIndexTodoIndex = e.target.dataset.edit;
        const splitIndex = projIndexTodoIndex.split('-');
        user.editTodoOpenStyle(splitIndex);

        document
            .querySelector('.todo-submit-button')
            .addEventListener('click', () => {
                obtainTodoData('edit', splitIndex);
            });
    };

    // todo may be 'new' or one of the named todo's
    const todoClickHandler = (e) => {
        // close the 'New Todo' or 'Edit Todo' input tabs if one is open
        resetNewTodo();
        resetEditTodo();

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

    // Changes the highlighted time period in the menu and the displayDateIndex variable
    const dateSelection = (dateIndex) => {
        document
            .querySelector('.selected-date')
            .classList.remove('selected-date');

        document
            .querySelector(`[data-date-index="${dateIndex}"]`)
            .classList.add('selected-date');

        displayDateIndex = dateIndex;
    };

    const dateClickHandler = (e) => {
        const dateIndex = e.target.dataset.dateIndex;
        dateSelection(dateIndex);

        refreshPage(displayProjIndex, displayDateIndex);
    };

    // Changes the highlighted project in the menu and the displayProjIndex variable
    // This will 'remember' which list of todos should be displayed
    const projectSelection = (projIndex) => {
        document
            .querySelector('.selected-project')
            .classList.remove('selected-project');

        document
            .querySelector(`[data-proj-index="${projIndex}"]`)
            .classList.add('selected-project');
        displayProjIndex = projIndex;
    };

    const projectClickHandler = (e) => {
        const projIndex = e.target.dataset.projIndex;

        if (projIndex === 'new') {
            console.log('creating new project');
            clickNewProject();
        } else {
            projectSelection(projIndex);

            refreshPage(displayProjIndex, displayDateIndex);
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

        refreshPage('all', displayDateIndex);
    };

    // loads the starting application screen
    const refreshPage = (projIndex, dateIndex, refreshType, splitIndex) => {
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
        displayDateIndex = dateIndex;

        // Highlight the 'remembered' project selection option
        document
            .querySelector(`[data-proj-index="${projIndex}"]`)
            .classList.add('selected-project');
        displayProjIndex = projIndex;

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

        // Open up a todo if it was just edited
        // Doesn't currently work for switching projects
        if (refreshType === 'edit') {
            user.displayUserData(splitIndex);
            document
                .querySelector('.todo-edit-button')
                .addEventListener('click', editClickHandler);
        }
    };

    // For the first load, show the todos from every project (set as 'all' at the beginning of userInterface
    refreshPage(displayProjIndex, displayDateIndex);
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
