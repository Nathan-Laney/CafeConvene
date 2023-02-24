const { DateTime } = require('luxon');
const {v4: uuidv4} = require('uuid');

const events = [
{
    id: '1',
    title: 'My life at Charlotte',
    content: 'At Charlotte I am taking many classes. I am almost done with my degree. Woohoo!',
    author: 'Laney',
    createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
},
{
    id: '2',
    title: 'Learning NBAD',
    content: 'Network-Based App Development has significant crossover with the content I did in software engineering. Where we use JS in NBAD, we used Python in SWE',
    author: 'Laney',
    createdAt: DateTime.local(2021, 2, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
},
{
    id: '3',
    title: 'My Spring Break',
    content: 'I don\'t have plans over spring break besides working. :(',
    author: 'Laney',
    createdAt: DateTime.local(2021, 2, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
}
];

exports.find = () => events;

exports.findById = (id) => events.find(event=>event.id === id);

exports.save = function(event) {
    event.id = uuidv4()
    event.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    events.push(event);
};

exports.updateById = function(id, newevent) {
    let event = events.find(event=>event.id === id);
    if (event){
        event.title = newevent.title;
        event.content = newevent.content;
        return true;
    } else {
        return false;
    }
};

exports.deleteById = function(id) {
    let index = events.findIndex(event => event.id === id);
    if (index !== -1) {
        events.splice(index, 1);
        return true;
    } else {
        return false;
    }
}