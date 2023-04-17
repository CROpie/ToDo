const testSort = [
    {
        name: '3',
        desc: '3',
        duedate: '2023-12-01',
        notes: '3',
        index: 0,
    },
    {
        name: '2',
        desc: '2',
        duedate: '2023-01-12',
        notes: '2',
        index: 1,
    },
    {
        name: '1',
        desc: '1',
        duedate: '2023-01-01',
        notes: '1',
        index: 2,
    },
];

const testSort2 = [
    {
        name: 'Project1',
        data: [
            {
                name: '1',
                desc: '1',
                duedate: '2023-12-12',
                notes: '1',
                index: 0,
            },
            {
                name: '2',
                desc: '2',
                duedate: '2023-06-06',
                notes: '2',
                index: 1,
            },
            {
                name: '3',
                desc: '3',
                duedate: '2023-10-10',
                notes: '3',
                index: 2,
            },
        ],
        index: 0,
    },
    {
        name: 'Project2',
        data: [
            {
                name: '1',
                desc: '1',
                duedate: '2023-01-01',
                notes: '1',
                index: 0,
            },
            {
                name: '2',
                desc: '2',
                duedate: '2023-12-12',
                notes: '2',
                index: 1,
            },
            {
                name: '3',
                desc: '3',
                duedate: '2023-02-02',
                notes: '3',
                index: 2,
            },
        ],
        index: 1,
    },
];

console.log(testSort2);
/*
const dateSort = (obj) => {
    const ordered = obj.sort((a, b) => (a.value > b.value ? 1 : -1));
    return ordered;
};
*/
const sortedUserDataList = [];
console.log(sortedUserDataList);

testSort2.forEach((project) => {
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

const ordered = sortedUserDataList.sort((a, b) =>
    a.duedate > b.duedate ? 1 : -1
);

console.log(ordered);

const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

const padMonth = month.toString().padStart(2, 0);
let day = date.getDate();
const padDay = day.toString().padStart(2, 0);

let currentDate = `${year}-${padMonth}-${padDay}`;
console.log(currentDate);

// interval needs to be < 28 for this to consistently work
// ie 7 days or 14 days would be fine
const checkDateRounding = (interval) => {
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

const x = checkDateRounding;

const y = '2023-04-16';
const z = '2023-04-17';
const a = '2023-04-18';
const b = '2023-04-19';
const c = '2023-04-20';
const d = '2023-04-21';
const e = '2023-04-22';
const f = '2023-04-23';
const g = '2023-04-24';
const h = '2012-04-25';
const i = '2023-04-26';
const j = '2025-04-27';
const k = '2023-04-28';

const dateList = [y, z, a, b, c, d, e, f, g, h, i, j, k];
console.log(dateList);

const newDate = checkDateRounding(7);
const todayDate = checkDateRounding(0);
console.log(newDate);

const filteredDates = dateList.filter((item) => {
    if (item < newDate && item >= todayDate) {
        return true;
    }
});

console.log(filteredDates);
