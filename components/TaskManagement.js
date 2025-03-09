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
  getDoc,
} from "firebase/firestore";
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

  // ✅ Real-time Firestore listener
  useEffect(() => {
    const tasksCollectionRef = collection(db, "dbs", "tasks", "tasks");

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
  }, []);

  // ✅ Handle Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;
  
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
  
    // Check if document exists before updating Firestore
    const taskRef = doc(db, "dbs", "tasks", "tasks", movedTask.id);
    const docSnap = await getDoc(taskRef);
  
    if (docSnap.exists()) {
      await updateDoc(taskRef, { status: movedTask.status });
    } else {
      console.warn("Task not found in Firestore. Refreshing tasks...");
      // Refresh tasks from Firestore to fix UI inconsistency
      refreshTasksFromFirestore();
    }
  };
  
  const refreshTasksFromFirestore = () => {
    const tasksCollectionRef = collection(db, "dbs", "tasks", "tasks");
  
    onSnapshot(tasksCollectionRef, (snapshot) => {
      const taskData = { todo: [], inProgress: [], done: [] };
      snapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        if (taskData[task.status]) {
          taskData[task.status].push(task);
        }
      });
      setTasks(taskData);
    });
  };
  

  // ✅ Add a new task to Firestore
  const addTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    await addDoc(collection(db, "dbs", "tasks", "tasks"), {
      title: taskTitle,
      description: taskDescription,
      status: "todo",
    });

    setTaskTitle("");
    setTaskDescription("");
  };

  // ✅ Delete task from Firestore
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "dbs", "tasks", "tasks", id));
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
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    await updateDoc(doc(db, "dbs", "tasks", "tasks", currentTask.id), {
      title: taskTitle,
      description: taskDescription,
    });

    setTaskTitle("");
    setTaskDescription("");
    setIsEditing(false);
    setCurrentTask(null);
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
