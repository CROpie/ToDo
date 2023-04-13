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

// to save:
// convert data to JSON via JSON.stringify(data)
// localStorage.setItem('key', string)

// to retrieve
// string = localStorage.getItem('key')
// data = JSON.parse(string)
