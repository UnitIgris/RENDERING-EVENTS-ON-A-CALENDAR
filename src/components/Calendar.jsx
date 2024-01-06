import { useEffect, useState } from "react";
import Event from "./Event";
import { DATA } from "../utils/data";
import   Loading  from "./Loading/Loading";

function Calendar() {
  const [events, setEvents] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
  });

  function findConflicts(list) {
    let updatedEvents = [...list];
    let eventsTimeMarkers = [];
    let calendarSlots = new Set();
    let longestEventChain = new Set();
    let maxCalendarSlot = 0;

    for (let i = 0; i < updatedEvents.length; i++) {
      updatedEvents[i] = {
        ...updatedEvents[i],
        calendarSlot: null,
        groupEventSize: null,
      };
      eventsTimeMarkers.push({
        time: updatedEvents[i].startValueInMinutes,
        marker: "start",
        id: updatedEvents[i].id,
      });

      eventsTimeMarkers.push({
        time: updatedEvents[i].endValueInMinutes,
        marker: "end",
        id: updatedEvents[i].id,
      });
    }
    eventsTimeMarkers = eventsTimeMarkers.sort(
      (a, b) => a.time - b.time || (a.marker === "end" ? -1 : 1)
    );

    eventsTimeMarkers.forEach((eventsTimeMarker) => {
      const currentEventIndex = updatedEvents.findIndex(
        (event) => event.id === eventsTimeMarker.id
      );

      if (eventsTimeMarker.marker === "start") {
        let calendarSlot = 0;
        while (calendarSlots.has(calendarSlot)) {
          calendarSlot++;
        }
        calendarSlots.add(calendarSlot);

        updatedEvents[currentEventIndex].calendarSlot = calendarSlot;

        maxCalendarSlot = Math.max(maxCalendarSlot, calendarSlot);

        //   currentEventIndex = updatedEvents.findIndex(event => event.id === eventsTimeMarker.id);
        //   if (currentEventIndex !== -1) {
        //     updatedEvents[currentEventIndex].calendarSlot = calendarSlot;
        //     calendarSlots.add(currentEventIndex);
        //   }
        // } else {
        //   calendarSlots.delete(currentEventIndex);
        // }

        longestEventChain.add(eventsTimeMarker.id);
      } else {
        calendarSlots.delete(updatedEvents[currentEventIndex].calendarSlot);

        if (calendarSlots.size === 0) {
          updatedEvents.forEach((event, index) => {
            if (longestEventChain.has(event.id)) {
              updatedEvents[index]["groupEventSize"] = maxCalendarSlot + 1;
            }
          });

          maxCalendarSlot = 0;
          longestEventChain.clear();
        }
      }
    });

    return updatedEvents;
  }

  const convertHoursInMinutes = (list) => {
    return list.map((event) => {
      const [eventHours, eventMinutes] = event.start.split(":");
      event.startValueInMinutes =
        parseInt(eventHours) * 60 + parseInt(eventMinutes);
      event.endValueInMinutes = event.startValueInMinutes + event.duration;
      return event;
    });
  };

  useEffect(() => {
    if (DATA.length) {
      let list = convertHoursInMinutes(DATA);
      // list = list.sort(
      //   (a, b) =>
      //     a.startValueInMinutes - b.startValueInMinutes ||
      //     a.duration - b.duration
      // );
      list = findConflicts(list);
      console.log("LIST:", list);
      setEvents(list);
    }
  }, []); 

  return (
    <> 
      {events ? (
        events.map((event, index) => (
          <Event
            key={index}
            index={index}
            event={event}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        ))
      ) : (
        <Loading />
      )}
    </>
  );
}
export default Calendar;
