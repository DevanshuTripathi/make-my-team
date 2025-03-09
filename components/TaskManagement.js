"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TaskManagement() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // ✅ Real-time Firestore listener for user-specific tasks
  useEffect(() => {
    if (!user) return;

    const tasksCollectionRef = collection(db, "tasks", user.uid, "tasks");

    const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
      const taskData = { todo: [], inProgress: [], done: [] };
      snapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        if (taskData[task.status]) {
          taskData[task.status].push(task);
        }
      });
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Handle Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination || !user) return;

    const { source, destination } = result;
    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];

    // Remove task from source column
    const [movedTask] = sourceColumn.splice(source.index, 1);
    movedTask.status = destination.droppableId;

    // Add task to destination column
    destColumn.splice(destination.index, 0, movedTask);

    // Update UI immediately
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    }));

    // Update Firestore
    try {
      const taskRef = doc(db, "tasks", user.uid, "tasks", movedTask.id);
      await updateDoc(taskRef, { status: movedTask.status });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // ✅ Add a new task to Firestore
  const addTask = async () => {
    if (!user) {
      alert("You must be logged in to add a task.");
      return;
    }

    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      const tasksCollectionRef = collection(db, "tasks", user.uid, "tasks");
      await addDoc(tasksCollectionRef, {
        title: taskTitle,
        description: taskDescription,
        status: "todo",
      });

      setTaskTitle("");
      setTaskDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Delete task from Firestore
  const deleteTask = async (id) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "tasks", user.uid, "tasks", id);
      await deleteDoc(taskRef);
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Open the Edit Modal
  const openEditModal = (task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setIsEditing(true);
  };

  // ✅ Update Task in Firestore
  const updateTask = async () => {
    if (!user) return;

    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", user.uid, "tasks", currentTask.id);
      await updateDoc(taskRef, {
        title: taskTitle,
        description: taskDescription,
      });

      setTaskTitle("");
      setTaskDescription("");
      setIsEditing(false);
      setCurrentTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      {/* ✅ Add/Edit Task Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 mt-8">Add New Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Task Description (Optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          {isEditing ? (
            <Button onClick={updateTask}>Update Task</Button>
          ) : (
            <Button onClick={addTask}>Add Task</Button>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-200 p-4 rounded-lg shadow-md min-h-[300px]"
                >
                  <h2 className="text-xl font-bold mb-4">
                    {columnId.toUpperCase()}
                  </h2>
                  {columnTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-white rounded-md shadow mb-2 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-bold">{task.title}</h4>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {/* Uncomment for Edit functionality */}
                            {/* <button
                              onClick={() => openEditModal(task)}
                              className="text-blue-500 text-sm"
                            >
                              Edit
                            </button> */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
