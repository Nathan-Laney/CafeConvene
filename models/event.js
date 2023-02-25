const { DateTime } = require('luxon');
const {v4: uuidv4} = require('uuid');
const path = require('path');

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
    details: 'Come try the trademark blends of Smelly Cat!',
    location: '514 E 36th Street, Charlotte, NC 28205',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
},
{
    id: '2',
    title: 'FORM VS FUNCTION',
    category: 'Coffee Tasting',
    host_name: 'HEX ROASTERS',
    details: 'FORM AND FUNCTION. OUR TWO MOST FAMOUS ROASTS. SIDE BY SIDE.',
    location: '1824 Statesville Ave. 101, Charlotte, NC 28206 ',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
},
{
    id: '3',
    title: 'Single-Origin vs. Blend',
    category: 'Coffee Tasting',
    host_name: 'Night Swim Coffee',
    details: 'Take a dip with Night Swim into the world of Coffee, learning about single origin roasts and blends.',
    location: '4500 Old Pineville Road, Charlotte, NC 28217',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
},
{
    id: '4',
    title: 'Cappuccino Creations',
    category: 'Latte Art Masterclass',
    host_name: 'Community Matters Cafe',
    details: 'All about our favourite foamy foreign cup of cappuccino, the Italian classic.',
    location: '821 W 1st St, Charlotte, NC 28202',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
},
{
    id: '5',
    title: 'Behind the Scenes with Amelies',
    category: 'Latte Art Masterclass',
    host_name: 'Amelies',
    details: 'We aren\'t just macarons!',
    location: '136 E. 36th St., Charlotte, NC 28205',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
},
{
    id: '6',
    title: 'Learning Lattes',
    category: 'Latte Art Masterclass',
    host_name: 'Not Just Coffee',
    details: 'Come learn how to make a basic heart at this free event, or your money back!',
    location: '224 E 7th St, Charlotte, NC 28202',
    start_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    end_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
    image: '/static/hex-form.png'
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

exports.save = function(event, image) {
    event.id = uuidv4()
    event.start_datetime = DateTime.fromISO(event.start_datetime_pre).toLocaleString(DateTime.DATETIME_SHORT);
    event.end_datetime = DateTime.fromISO(event.end_datetime_pre).toLocaleString(DateTime.DATETIME_SHORT);
    if (image) {
        image.mv(__dirname + '/../public/upload/' + image.name);
    };
    event.image = '/upload/' + image.name;
    events.push(event);
};

exports.updateById = function(id, newevent) {
    let event = events.find(event=>event.id === id);
    if (event){
        event.title = newevent.title;
        event.details = newevent.details;
        event.category = newevent.category;
        event.start_datetime = DateTime.fromISO(newevent.start_datetime_pre).toLocaleString(DateTime.DATETIME_SHORT);
        event.end_datetime = DateTime.fromISO(newevent.end_datetime_pre).toLocaleString(DateTime.DATETIME_SHORT);
        event.location = newevent.location;
        event.host_name = newevent.host_name;

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