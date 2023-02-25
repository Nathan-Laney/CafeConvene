const { DateTime } = require('luxon');
const {v4: uuidv4} = require('uuid');

const events = [
// {
//     id: '',
//     title: '',
//     category: '',
//     host_name: '',
//     details: '',
//     location: '',
//     start_datetime: '',
//     end_datetime: '',
//     image: ''
// },
{
    id: '1',
    title: 'Smelly Cat Roasteries Tasting Demo',
    category: 'Coffee Tasting',
    host_name: 'Smelly Cat Roasteries',
    details: '',
    location: '514 E 36th Street, Charlotte, NC 28205',
    start_datetime: '',
    end_datetime: '',
    image: ''
},
{
    id: '2',
    title: 'FORM VS FUNCTION',
    category: 'Coffee Tasting',
    host_name: 'HEX ROASTERS',
    details: '',
    location: '1824 Statesville Ave. 101, Charlotte, NC 28206 ',
    start_datetime: '',
    end_datetime: '',
    image: ''
},
{
    id: '3',
    title: 'Single-Origin vs. Blend',
    category: 'Coffee Tasting',
    host_name: 'Night Swim Coffee',
    details: '',
    location: '4500 Old Pineville Road, Charlotte, NC 28217',
    start_datetime: '',
    end_datetime: '',
    image: ''
},
{
    id: '4',
    title: 'Cappuccino Creations',
    category: 'Latte Art Masterclass',
    host_name: 'Community Matters Cafe',
    details: '',
    location: '821 W 1st St, Charlotte, NC 28202',
    start_datetime: '',
    end_datetime: '',
    image: ''
},
{
    id: '5',
    title: 'Behind the Scenes with Amelies',
    category: 'Latte Art Masterclass',
    host_name: 'Amelies',
    details: '',
    location: '136 E. 36th St., Charlotte, NC 28205',
    start_datetime: '',
    end_datetime: '',
    image: ''
},
{
    id: '6',
    title: 'Learning Lattes',
    category: 'Latte Art Masterclass',
    host_name: 'Not Just Coffee',
    details: '',
    location: '224 E 7th St, Charlotte, NC 28202',
    start_datetime: '',
    end_datetime: '',
    image: ''
}
];

exports.find = () => events;

exports.findById = (id) => events.find(event=>event.id === id);

exports.findByCategory = (category) => events.find(event=>event.category === category);

exports.findAllCategories = function() {
    const eventCategories = [];
    events.forEach(element => {
        if (eventCategories.indexOf(element.category) === -1) {
            eventCategories.push(element.category);
        }
    });
    return eventCategories;
};

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