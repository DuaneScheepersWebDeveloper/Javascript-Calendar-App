/**
 **⁡⁣⁣⁢ LOOPS (or logic operators take your pick)⁡
 **
 ** Return the number (count) of vowels in the given string. ie : your name for example
 ** We will consider a, e, i, o, u as vowels for this Kata (but not y).
 ** The input string will only consist of lower case letters and/or spaces.
 */
const countVowels = (string) => {
  const vowels = ["a", "e", "i", "o", "u"];
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (vowels.includes(string[i])) {
      count++;
    }
  }
  return count;
};

// const countVowels=(string)=> {
//     var vowelsCount = 0;
//     for (index in string){
//       switch (string[index]) {
//       case 'a':
//       case 'e':
//       case 'i':
//       case 'o':
//       case 'u':
//       vowelsCount++;
//       break;
//       }
//     }
//     return vowelsCount;
//   }

console.log(countVowels("Duane")); //expected result 3
console.log(countVowels("Benjamin")); //expected result 3

//⁡⁢⁣⁢================================================================⁡
/** ⁡⁣⁣⁢My Calender Application
⁡⁣⁣⁢**⁡ ⁡⁣⁢⁣Our global variables⁡
** @count helps us to keep track of what month we are on.
** @clicked is what ever day we have clicked on the calender.
** @events is an object we store in local storage . (state)
** @weekdays is days of the week.
** @references the calender reference on our HTML
** ⁡⁣⁢⁣Our Functions
** @create calender loads the calender as the window reloads
**⁡
*/

let count = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.querySelector('#calendar');
const newEventModal = document.querySelector('#newEventModal');
const deleteEventModal = document.querySelector('#deleteEventModal');
const backDrop = document.querySelector('#modalBackDrop');
const eventTitleInput = document.querySelector('#eventTitleInput');
//----------------------------------------------------------------
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//----------------------------------------------------------------
const createCalender=()=> {
  const current = new Date(); // get the date from the Date object for the calenders 

  if (count !== 0) {
    current.setMonth(current.getMonth() + count);
  }

  const day = current.getDate();
  const month = current.getMonth();
  const year = current.getFullYear();

  //-------------------------
  const firstDayOfMonth = new Date(year, month, 1);
  console.log(firstDayOfMonth);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  console.log("there are "+ daysInMonth +" in the month");
  
//⁡⁢⁢⁢@daysInMonth. the last variable in the Date object is the day . 0 is the first day of the month⁡
//⁡⁢⁢⁢@firstDayOfMonth. by adding 1 to month we are actually going to the next month⁡⁡
  
  const options={
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: "Africa/Johannesburg",
  };

  const dateString = firstDayOfMonth.toLocaleDateString('en-ZA', options);
  console.log("the date string is "+dateString); // Saturday, 2023/04/01

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
 
  // ⁡⁢⁢⁢@paddingDays is the number of days that don't show in our calendar⁡

  //-------------------------
  document.getElementById('monthDisplay').innerText = 
    `${current.toLocaleDateString('en-ZA', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    //⁡⁢⁢⁢reason why I'm adding the padding days is so I can render⁡
    //⁡⁢⁢⁢empty squares on the screen.⁡
    
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {

      daySquare.innerText = i - paddingDays;
      // ⁡⁢⁢⁢this is going to allow us to know what day we are on⁡
      
      //⁡⁢⁢⁢this allows to know what is today RIGHT KNOW⁡
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && count === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}
//----------------------------------------------------------------
const openModal=(date)=> {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.querySelector('#eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}
//----------------------------------------------------------------
const closeModal=()=> { 
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  createCalender();
}
//----------------------------------------------------------------
const saveEvent=()=> {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}
//----------------------------------------------------------------
const deleteEvent=()=> {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}
//----------------------------------------------------------------
/**
 ** @initButtons 
 ** allows us to render a new calendar when we click on a button 
 ** allows us to open and close our modals by making use of the
 ** saveEvent, closeModal and deleteEvent
 */
const initButtons=()=> {
  document.querySelector('#nextButton').addEventListener('click', () => {
    count++;
    createCalender();
  });

  document.querySelector('#backButton').addEventListener('click', () => {
    count--;
    createCalender();
  });

  document.querySelector('#saveButton').addEventListener('click', saveEvent);
  document.querySelector('#cancelButton').addEventListener('click', closeModal);
  document.querySelector('#deleteButton').addEventListener('click', deleteEvent);
  document.querySelector('#closeButton').addEventListener('click', closeModal);
}
//----------------------------------------------------------------
initButtons();
createCalender();
