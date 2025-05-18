import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { v4 as uuidv4 } from "uuid";
import TextField from "@mui/material/TextField";
import MenuIcon from "@mui/icons-material/Menu";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import profile from "./assets/profile.webp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dragAndDropPlugin = createDragAndDropPlugin();

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const [form, setForm] = useState({
    id: uuidv4(),
    title: "",
    start: "",
    end: "",
    calendarId: "personal",
  });

  const [behind, setBehind] = useState(false);
  const [behindForUpdate, setBehindForUpdate] = useState(false);
  const [mode, setMode] = useState(true);
  const [initialEvents, setInitialEvents] = useState([
    {
      id: 1,
      title: "Coffee with John hello",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-17 10:05",
      end: "2025-05-17 10:35",
      calendarId: "leisure",
    },
    {
      id: 2,
      title: "Ski trip",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-18 12:00",
      end: "2025-05-18 18:00",
      calendarId: "personal",
    },
    {
      id: 3,
      title: "Ski trip",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-18 01:00",
      end: "2025-05-18 02:00",
      calendarId: "work",
    },
    {
      id: 4,
      title: "Ski trip",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-17 03:00",
      end: "2025-05-17 04:00",
      calendarId: "school",
    },
    {
      id: 5,
      title: "Ski trip",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-18 04:00",
      end: "2025-05-18 05:00",
      calendarId: "leisure",
    },
    {
      id: 6,
      title: "Ski trip",
      description: "this is coffe trimnrndjskabfjhsdbfdh",
      start: "2025-05-17 05:00",
      end: "2025-05-17 06:00",
      calendarId: "personal",
    },
  ]);

  const [checked, setChecked] = useState([
    "personal",
    "work",
    "school",
    "leisure",
  ]);

  const toggleCheckBox = (e) => {
    if (checked.includes(e.target.value)) {
      setChecked((pre) => pre.filter((item) => item !== e.target.value));
    } else {
      setChecked((pre) => [...pre, e.target.value]);
    }
  };

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    calendars: {
      personal: {
        colorName: "personal",
        lightColors: {
          main: "#f9d71c",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
      work: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
      leisure: {
        colorName: "leisure",
        lightColors: {
          main: "#1cf9b0",
          container: "#dafff0",
          onContainer: "#004d3d",
        },
        darkColors: {
          main: "#c0fff5",
          onContainer: "#e6fff5",
          container: "#42a297",
        },
      },
      school: {
        colorName: "school",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
      },
    },
    events: initialEvents,
    plugins: [eventsService, dragAndDropPlugin],
    callbacks: {
      onEventClick(calendarEvent) {
        setBehind(true);
        setBehindForUpdate(true);
        return setForm({
          id: calendarEvent.id,
          title: calendarEvent.title,
          start: calendarEvent.start,
          end: calendarEvent.end,
          calendarId: calendarEvent.calendarId,
        });
      },
      onClickDateTime(dateTime) {
        setBehind(true);
        console.log(dateTime);
        return setForm((pre) => {
          return { ...pre, start: `${dateTime}` };
        });
      },
    },
  });

  console.log(form);

  const SetBothButtonFalse = () => {
    setBehindForUpdate(false);
    setBehind(false);
  };

  const OnDoneHandler = (e) => {
    e.preventDefault();
    setBehindForUpdate(false);
    setBehind(false);
    eventsService.remove(form.id);
  };

  const onSubmitUpdateHandler = (e) => {
    e.preventDefault();
    setBehindForUpdate(false);
    setBehind(false);
    eventsService.update({
      id: form.id,
      title: form.title,
      start: form.start.replace("T", " "),
      end: form.end.replace("T", " "),
      calendarId: form.calendarId,
    });

    setForm({
      id: "",
      title: "",
      start: "",
      end: "",
      calendarId: "personal",
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!form.title || !form.start || !form.end) return;

    const newEvent = {
      id: uuidv4(),
      title: form.title,
      start: form.start.replace("T", " "),
      end: form.end.replace("T", " "),
      calendarId: form.calendarId,
    };

    eventsService.add(newEvent);
    setInitialEvents((pre) => [...pre, newEvent]);
    setForm({
      id: "",
      title: "",
      start: "",
      end: "",
      calendarId: "personal",
    });

    setBehind(false);
  };

  const modeChange = () => {
    setMode((prev) => !prev);
    if (mode) {
      calendar.setTheme("dark");
    } else {
      calendar.setTheme("light");
    }
  };

  const onchange = (e) => {
    const { name, value } = e.target;

    if (name === "end" && new Date(value) <= new Date(form.start)) {
      toast.error("⛔ End time must be after start time!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    const cloneOfEvents = structuredClone(initialEvents);
    const FilterArray = [];
    cloneOfEvents.filter((item) => {
      for (const element of checked) {
        if (item.calendarId === element) {
          const FilterEvents = item;
          FilterArray.push(FilterEvents);
        }
      }
    });
    eventsService.set(FilterArray);
  }, [checked, initialEvents]);

  const [menuToggle, setMenuToggle] = useState(false);

  return (
    <div className="flex flex-col sm:flex sm:flex-row ">
      <ToastContainer />
      <div
        className={` ${
          menuToggle ? "w-screen p-5" : "w-0"
        } flex flex-col justify-between h-screen ${
          mode ? "text-black bg-white" : "text-white bg-[#151318]"
        } transition-all sm:hidden ease-in absolute top-0 left-0 z-20 overflow-hidden`}
      >
        <div className="flex justify-between">
          <div
            className={`${
              menuToggle ? "block" : "hidden"
            } sm:hidden flex flex-col ${mode ? "text-black" : "text-white"}`}
          >
            <div className="flex gap-4 ">
              <input
                id="personal"
                type="checkbox"
                className="scale-150 accent-[#a39743]"
                value={"personal"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="personal" className="text-2xl font-semibold">
                Personal
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="Wrok"
                type="checkbox"
                className="scale-150 accent-[#a34259]"
                value={"work"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="Wrok" className="text-2xl font-semibold">
                Wrok
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="leisure"
                type="checkbox"
                className="scale-150 accent-[#43a296]"
                value={"leisure"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="leisure" className="text-2xl font-semibold">
                leisure
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="School"
                type="checkbox"
                className="scale-150 accent-[#426aa2]"
                value={"school"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="School" className="text-2xl font-semibold">
                School
              </label>
            </div>
          </div>
          <div
            onClick={() => setMenuToggle(false)}
            className={` ${menuToggle ? "block" : "hidden"}`}
          >
            <CloseIcon />
          </div>
        </div>
        <div
          className={` sm:hidden w-full h-20 ${
            mode ? "bg-gray-100" : "bg-[#d1bcfe]"
          } rounded-3xl flex justify-between p-5`}
        >
          <div className="w-10 h-10 bg-red-200 rounded-full">
            <img className="w-10 h-10 rounded-full" src={profile} alt="" />
          </div>
          <button
            className={`font-semibold ${
              mode ? "bg-[#d1bcfe]" : "bg-black text-white"
            } py-2 px-3 rounded-2xl cursor-pointer`}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className={`flex flex-row justify-between relative mt-14 sm:flex-col sm:mt-0 md:w-[25vw] lg:w-[20vw] p-5 z-1 ${
          mode ? "bg-white" : "bg-[#151318]"
        }`}
      >
        <div
          onClick={() => setMenuToggle((pre) => !pre)}
          className="block sm:hidden"
        >
          <MenuIcon className={` ${mode ? "text-black" : "text-white"}`} />
        </div>
        <div className="flex sm:flex-col sm:items-left sm:gap-10">
          <button
            onClick={modeChange}
            className="bg-[#d1bcfe] font-semibold px-10 py-1 sm:py-2 sm:px-5 sm:text-2xl lg:px-8 rounded-md cursor-pointer"
          >
            {mode ? "Dark Mode" : "Light Mode"}
          </button>
          <div
            className={`PCsideBar flex flex-col  ${
              mode ? "text-black" : "text-white"
            }`}
          >
            <div className="flex gap-4">
              <input
                id="personal"
                type="checkbox"
                className="scale-150 accent-[#a39743]"
                value={"personal"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="personal" className="text-2xl font-semibold">
                Personal
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="Wrok"
                type="checkbox"
                className="scale-150 accent-[#a34259]"
                value={"work"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="Wrok" className="text-2xl font-semibold">
                Wrok
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="leisure"
                type="checkbox"
                className="scale-150 accent-[#43a296]"
                value={"leisure"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="leisure" className="text-2xl font-semibold">
                leisure
              </label>
            </div>
            <div className="flex gap-4">
              <input
                id="School"
                type="checkbox"
                className="scale-150 accent-[#426aa2]"
                value={"school"}
                defaultChecked
                onChange={toggleCheckBox}
              />
              <label htmlFor="School" className="text-2xl font-semibold">
                School
              </label>
            </div>
          </div>
        </div>

        <div
          className={`hidden sm:w-full ${
            mode ? "bg-gray-100" : "bg-[#d1bcfe] "
          }  h-18 rounded-3xl sm:flex justify-between items-center sm:p-3 lg:p-5`}
        >
          <img
            className="sm:w-8 sm:h-8  lg:w-10 lg:h-10 rounded-full"
            src={profile}
            alt=""
          />
          <button
            className={`font-semibold  ${
              mode ? "bg-[#d1bcfe]" : "bg-black text-white"
            } sm:text-[16px] sm:py-2 sm:px-3 rounded-2xl cursor-pointer`}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        onClick={SetBothButtonFalse}
        className={`BehindForm ${behind ? "z-index-9" : ""}`}
      >
        <form
          onClick={(e) => e.stopPropagation()}
          className={`AddForm w-95 ${behind ? "z-index-10" : ""} ${
            mode ? "text-black bg-white" : "text-white bg-[#1d1b1f]"
          } border border-gray-300 rounded-2xl p-10 flex flex-col gap-5`}
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onchange}
            required
            id="outlined-basic"
            className={`border border-gray-200 p-2 ${behind ? "z-index-9" : "z-0"} ${
              mode ? "text-black" : "text-white"
            }`}
          />
          <div className="flex flex-col justify-between sm:flex-row gap-5">
            <div className="flex flex-col border border-gray-200 sm:p-2">
              <label htmlFor="start">Task start at : </label>
              <input
                id="start"
                name="start"
                value={form.start}
                type="datetime-local"
                onChange={onchange}
                required
              />
            </div>
            <div className="flex flex-col border border-gray-200 p-2">
              <label htmlFor="end">Task end at</label>
              <input
                id="end"
                name="end"
                value={form.end}
                type="datetime-local"
                onChange={onchange}
              />
            </div>
          </div>
          <select
            name="calendarId"
            value={form.calendarId}
            onChange={onchange}
            className="p-3 border border-gray-200 cursor-pointer"
            required
          >
            <option value="personal" className="bg-[#a39743]">
              Personal
            </option>
            <option value="work" className="bg-[#a34259]">
              Work
            </option>
            <option value="leisure" className="bg-[#43a296]">
              Leisure
            </option>
            <option value="school" className="bg-[#426aa2]">
              School
            </option>
          </select>

          {behindForUpdate ? (
            <>
              <button
                onClick={onSubmitUpdateHandler}
                type="submit"
                className="bg-[#d1bcfe] font-semibold cursor-pointer py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={OnDoneHandler}
                type="submit"
                className="bg-[#d1bcfe] font-semibold cursor-pointer py-2 rounded-md"
              >
                Done
              </button>
            </>
          ) : (
            <button
              onClick={onSubmitHandler}
              type="submit"
              className="bg-[#d1bcfe] font-semibold cursor-pointer py-2 rounded-md"
            >
              Add event
            </button>
          )}
        </form>
      </div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
