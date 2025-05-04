"use client";

import Image from "next/image";
import { motion, useScroll, useTransform,AnimatePresence,useMotionValue } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import { useInView } from "react-intersection-observer";
import React, { SetStateAction, useEffect, useState,useRef } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
 const users = 
    {
      username: "Guest",
      password: "guest@123",
      lastHabitUpdate: "2025-05-04",
      isloggedIn: false,
      habits: [
        {
          name: "Drink Water",
          dailyGoal: "Drink 8 glasses",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "💧",
          limit: 8,
          selected: false
        },
        {
          name: "Sleep 8hrs",
          dailyGoal: "Sleep for 8 hours",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "😴",
          limit: 8,
          selected: false
        },
        {
          name: "Daily Workout",
          dailyGoal: "30 mins of exercise",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "💪",
          limit: 30,
          selected: false
        },
        {
          name: "Read Books",
          dailyGoal: "Read 10 pages",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "📚",
          limit: 10,
          selected: false
        },
        {
          name: "Meditation",
          dailyGoal: "Meditate for 10 minutes",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "🧘",
          limit: 10,
          selected: false
        },
        {
          name: "Eat Healthy",
          dailyGoal: "Eat 3 clean meals",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "🥗",
          limit: 3,
          selected: false
        },
        {
          name: "No Social Media",
          dailyGoal: "Limit to 30 mins",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "📵",
          limit: 30,
          selected: false
        },
        {
          name: "Journaling",
          dailyGoal: "Write 5 lines",
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
          avatar: "📓",
          limit: 5,
          selected: false
        }
      ]
    };
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [habitUsers, setHabitUsers] = useState(users);
  // const [userHabits, setUserHabits] = useState<string[]>([]);
 
  useEffect(() => {

    const storedUsers = localStorage.getItem("habit_users");
    if (storedUsers) {
    
      const parsedUsers = JSON.parse(storedUsers);
  
      
      // Find the user who is currently logged in
      const activeUser = parsedUsers.find(
        (user: any) => user.isloggedIn === true
      );
      if (activeUser) {
        setHabitUsers(activeUser);
        setLoggedInUser(activeUser.username);
      }else{
        
        setHabitUsers(users);
      }
    }else{
      setHabitUsers(users);
    }
    
  }, []);
  
  const updateHabits = (updatedHabits: any[]) => {
    const usersJSON = localStorage.getItem("habit_users");
    if (!usersJSON) return;

    const users = JSON.parse(usersJSON);
    const userIndex = users.findIndex((u: any) => u.isloggedIn === true);
    if (userIndex === -1) return;

    users[userIndex].habits = updatedHabits;
    users[userIndex].lastHabitUpdate = new Date().toISOString().split("T")[0];
    localStorage.setItem("habit_users", JSON.stringify(users));
    setHabitUsers(users[userIndex]); // re-render
  };
  const [bgColor, setBgColor] = useState("bg-blue-200");
  const { scrollY } = useScroll();
  const yHabits = useTransform(scrollY, [0, 500], [0, -50]); // Adjust range as needed
  const yHero = useTransform(scrollY, [0, 500], [0, -100]); // Customize the range as needed
  const yFooter = useTransform(scrollY, [0, 500], [0, -30]); // Adjust as needed

  const [heroRef, heroInView] = useInView({ threshold: 0.5 });
  const [habitsRef, habitsInView] = useInView({ threshold: 0.5 });
  const [footerRef, footerInView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (heroInView) setBgColor("bg-blue-200");
    else if (habitsInView) setBgColor("bg-blue-50");
    else if (footerInView) setBgColor("bg-white");
  }, [heroInView, habitsInView, footerInView]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div
      className={clsx("transition-colors duration-700 min-h-screen", bgColor)}
    >
      {/* Modal components */}
       {profileOpen && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          username={habitUsers.username}
          password={habitUsers.password}
        />
      )}
      
      <AuthModal
        isOpen={showAuth}
        isSignup={authMode === "signup"}
        onClose={() => setShowAuth(false)}
        onSuccess={(username) => setLoggedInUser(username)}
        setHabitUsers={setHabitUsers}
      />
      <AddHabitModal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        initialHabits={habitUsers.habits}
        onSave={(updatedHabits) => {
          const updatedUser = {
            ...habitUsers,
            habits: updatedHabits,
          };
          const allUsers = JSON.parse(
            localStorage.getItem("habit_users") || "[]"
          );
          const userIndex = allUsers.findIndex(
            (u: any) => u.username === habitUsers.username
          );
          if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            localStorage.setItem("habit_users", JSON.stringify(allUsers));
          }
          setHabitUsers(updatedUser);
        }}
      />

      {/* Header */}
      <Header
        isLoggedIn={habitUsers.isloggedIn}
        setProfileOpen={setProfileOpen}
        setAuthMode={setAuthMode}
        setHabitModalOpen={setHabitModalOpen}
        setShowAuth={setShowAuth}
      />
      
      {/* Hero Section */}
    
       <div
        ref={heroRef}
        className="relative min-h-screen p-4 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >
        <CursorTrail/>
        <motion.div
          style={{ y: yHero }} // Apply the parallax scroll effect here
          className="absolute inset-0 z-[-10]"
        >
          <Image
            src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid&w=740"
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {loggedInUser || habitUsers.username}! 👋
          </h1>
          <p className="text-gray-600 max-w-xl">
            Here's are some good habits which you should follow daily. Keep
            going strong!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          { habitUsers.habits.map((item, idx) => (
            
            <div
              key={idx}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl">{item.avatar}</div>
              <div className="mt-4 text-xl font-semibold text-gray-700">
                {item.name}
              </div>
              <div className="text-sm text-gray-500">{item.dailyGoal}</div>
            </div>
          ))}
        </motion.div>
      </div>

{/* Habits tracker sections */}

{habitUsers?.habits?.length > 0 &&
  habitUsers.habits.some(habit => habit.selected) && (<div>
  <motion.div style={{ y: yHabits }}>
    <div ref={habitsRef}>
      <HabitsSection habits={habitUsers.habits} onUpdate={updateHabits} />
    </div>
  </motion.div>
</div>)}
  

      {/* Footer */}
  
      {habitUsers?.habits?.length > 0 &&
  habitUsers.habits.some(habit => habit.selected) && (
        <div>
  <motion.div style={{ y: yFooter }}>
    <div ref={footerRef}>
      <Footer />
    </div>
  </motion.div>
</div>)}
    </div>
  );
}

const NUM_TRAILS = 12

const CursorTrail = () => {
  const [trail, setTrail] = useState(
    Array.from({ length: NUM_TRAILS }, () => ({ x: 0, y: 0 }))
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setTrail(prev => {
        const newTrail = [...prev]
        newTrail[0] = { x: clientX, y: clientY }
        for (let i = 1; i < NUM_TRAILS; i++) {
          newTrail[i] = {
            x: newTrail[i - 1].x * 0.9 + newTrail[i].x * 0.1,
            y: newTrail[i - 1].y * 0.9 + newTrail[i].y * 0.1,
          }
        }
        return newTrail
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {trail.map((point, idx) => (
        <motion.div
          key={idx}
          animate={{ x: point.x - 8, y: point.y - 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-4 h-4 bg-blue-400 rounded-full absolute"
          style={{
            opacity: (NUM_TRAILS - idx) / NUM_TRAILS,
            filter: `blur(${(NUM_TRAILS - idx) * 0.3}px)`,
          }}
        />
      ))}
    </div>
  )
}

const Header = ({
  isLoggedIn = false,
  setProfileOpen,
  setAuthMode,
  setShowAuth,
  setHabitModalOpen,
}: {
  isLoggedIn?: boolean;
  setProfileOpen: React.Dispatch<SetStateAction<boolean>>;
  setAuthMode: React.Dispatch<SetStateAction<"signin" | "signup">>;
  setShowAuth: React.Dispatch<SetStateAction<boolean>>;
  setHabitModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`
        w-full fixed top-0 z-50 px-6 py-4 flex justify-end items-center transition-colors duration-300',
        ${
          isTop?'bg-transparent':
          'backdrop-blur-md'
        }
      `}
    >
      {/* Right side */}
      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md cursor-pointer text-gray-700 hover:bg-white/30 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-4 w-40 bg-white rounded-md shadow-lg z-10"
              >
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(true);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      setHabitModalOpen(true);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    Habits
                  </li>
                  <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    const users = JSON.parse(localStorage.getItem("habit_users") || "[]");
                
                    const updatedUsers = users.map((user: any) => {
                      if (user.isloggedIn) {
                        return { ...user, isloggedIn: false };
                      }
                      return user;
                    });
                
                    localStorage.setItem("habit_users", JSON.stringify(updatedUsers));
                    window.location.reload();
                  }}
                  >
                    Logout
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => {
              setAuthMode("signin");
              setShowAuth(true);
            }}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-blue-700 border border-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode("signup");
              setShowAuth(true);
            }}
            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

type AuthModalProps = {
  isOpen: boolean;
  isSignup?: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
  setHabitUsers: React.Dispatch<SetStateAction<{
    username: string;
    password: string;
    lastHabitUpdate: string;
    isloggedIn: boolean;
    habits: {
      name: string;
      dailyGoal: string;
      todayProgress: number;
      weeklyProgress: never[];
      monthlyProgress: never[];
      avatar: string;
      limit: number;
      selected: boolean;
    }[];
  }>>
};
const defaultHabits = [
  {
    name: "Drink Water",
    dailyGoal: "Drink 8 glasses",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "💧",
    limit: 8,
    selected: false,
  },
  {
    name: "Sleep 8hrs",
    dailyGoal: "Sleep for 8 hours",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "😴",
    limit: 8,
    selected: false,
  },
  {
    name: "Daily Workout",
    dailyGoal: "30 mins of exercise",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "💪",
    limit: 30,
    selected: false,
  },
  {
    name: "Read Books",
    dailyGoal: "Read 10 pages",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "📚",
    limit: 10,
    selected: false,
  },
  {
    name: "Meditation",
    dailyGoal: "Meditate for 10 minutes",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "🧘",
    limit: 10,
    selected: false,
  },
  {
    name: "Eat Healthy",
    dailyGoal: "Eat 3 clean meals",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "🥗",
    limit: 3,
    selected: false,
  },
  {
    name: "No Social Media",
    dailyGoal: "Limit to 30 mins",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "📵",
    limit: 30,
    selected: false,
  },
  {
    name: "Journaling",
    dailyGoal: "Write 5 lines",
    todayProgress: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    avatar: "📓",
    limit: 5,
    selected: false,
  },
];

const AuthModal = ({
  isOpen,
  isSignup = false,
  onClose,
  onSuccess,
  setHabitUsers,
}: AuthModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = () => {
    if (!username || !password) return alert("All fields are required.");

    let users = JSON.parse(localStorage.getItem("habit_users") || "[]");

    if (isSignup) {
      if (password !== rePassword) return alert("Passwords do not match.");
      if (password.length < 6)
        return alert("Password must be at least 6 characters.");

      const userExists = users.some((user: any) => user.username === username);
      if (userExists) return alert("Username already exists.");

      const newUser = {
        username,
        password,
        lastHabitUpdate: new Date().toISOString().split("T")[0], // e.g., 2025-05-04
        isloggedIn: true,
        habits: defaultHabits,
      };

      users.push(newUser);
      localStorage.setItem("habit_users", JSON.stringify(users));
      setHabitUsers(newUser);
    } else {
      const userIndex = users.findIndex(
        (user: any) => user.username === username && user.password === password
      );

      if (userIndex === -1) return alert("Invalid credentials");

      // Log out all users first
      users = users.map((user: any) => ({ ...user, isloggedIn: false }));
      users[userIndex].isloggedIn = true;

      localStorage.setItem("habit_users", JSON.stringify(users));
      setHabitUsers(users[userIndex]);
    }

    onSuccess(username);
    setUsername("");
    setPassword("");
    setRePassword("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={22} className="cursor-pointer" />
            </button>

            <div className="flex flex-col items-center mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full border-4 border-white shadow-md"
              />
              <h2 className="text-xl font-bold mt-3">
                {isSignup ? "Create an Account" : "Sign In"}
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full border px-3 py-2 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isSignup && (
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  className="w-full border px-3 py-2 rounded-md"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
              )}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700"
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileModal = ({
  isOpen,
  onClose,
  username,
  password,
}: {
  isOpen: boolean;
  username: string;
  password: string;
  onClose: () => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      const users = JSON.parse(localStorage.getItem("habit_users") || "[]");

      const updatedUsers = users.map((user: any) => {
        if (user.isloggedIn && user.username === username) {
          return {
            ...user,
            password: newPassword,
          };
        }
        return user;
      });

      localStorage.setItem("habit_users", JSON.stringify(updatedUsers));

      setEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
    } else {
      alert("Passwords must match and be at least 6 characters.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-opacity-50 backdrop-blur-md flex justify-center items-center"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Avatar"
                className="w-20 h-20 rounded-full mb-4 border-4 border-blue-300"
              />
              <h2 className="text-xl font-semibold mb-2">{username}</h2>

              <div className="w-full text-left mt-4">
                <label className="text-sm text-gray-600">Password:</label>

                {!editing ? (
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium tracking-wide">
                      {Array(password.length)
                        .fill("•")
                        .map((dot, index) => (
                          <span key={index}>{dot}</span>
                        ))}
                    </p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-blue-600 cursor-pointer text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full border rounded-md px-3 py-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full border rounded-md px-3 py-2"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      onClick={handleSave}
                      className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const COLORS = ["#4ADE80", "#D1D5DB"]; // green for progress, gray for remaining

type HabitCardProps = {
  name: string;
  avatar: string;
  progress: number;
  limit: number;
  onProgressChange: (progress: number) => void;
};

const HabitCard = ({
  name,
  progress,
  avatar,
  limit,
  onProgressChange,
}: HabitCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgress, setEditedProgress] = useState(progress);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && inView) {
      const timeout = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [inView, mounted, progress]);

  const percentage = Math.min(
    100,
    Math.round((animatedProgress / limit) * 100)
  );

  const data = [
    { name: "Completed", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  const handleIncrease = () => {
    if (editedProgress < limit) {
      setEditedProgress(editedProgress + 1);
    }
  };

  const handleDecrease = () => {
    if (editedProgress > 0) {
      setEditedProgress(editedProgress - 1);
    }
  };

  const handleSave = () => {
    setAnimatedProgress(editedProgress);
    onProgressChange(editedProgress); // <-- update parent
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProgress(progress);
    setIsEditing(false);
  };

  if (!mounted) return null;

  return (
    <motion.div
      ref={ref}
      className="relative shadow-blue-300 bg-white shadow-xl rounded-xl p-6 w-full sm:w-64 flex flex-col items-center gap-4 transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-4xl">{avatar}</div>

      <h3 className="text-lg font-semibold text-center">{name}</h3>

      {/* Pencil button positioned correctly */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute cursor-pointer top-4 right-4 text-xl text-gray-500 hover:text-gray-700"
      >
        ✏️
      </button>

      {/* Pie Chart or Edit Mode */}
      {isEditing ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={handleDecrease} className="text-lg text-gray-600">
              -
            </button>
            <input
              type="number"
              value={editedProgress}
              onChange={(e) =>
                setEditedProgress(Math.min(Math.max(0, +e.target.value), limit))
              }
              className="w-12 text-center border border-gray-300 rounded-md"
              min={0}
              max={limit}
            />
            <button onClick={handleIncrease} className="text-lg text-gray-600">
              +
            </button>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-700 text-lg"
            >
              ✔
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:text-red-700 text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      ) : (
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={40}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      )}

      <motion.p
        className="text-sm text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0, y: 5 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        {percentage}% completed
      </motion.p>
    </motion.div>
  );
};

const AddHabitModal = ({
  isOpen,
  onClose,
  initialHabits = [],
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialHabits: any[]; // Full habit objects
  onSave: (updatedHabits: any[]) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const selectedHabitNames = initialHabits
        .filter((habit) => habit.selected)
        .map((habit) => habit.name);
      setSelected(selectedHabitNames);
    }
  }, [isOpen, initialHabits]);

  const toggleHabit = (habitName: string) => {
    setSelected((prev) =>
      prev.includes(habitName)
        ? prev.filter((name) => name !== habitName)
        : [...prev, habitName]
    );
  };

  const handleSave = () => {
    const removed = initialHabits
      .filter((habit) => habit.selected && !selected.includes(habit.name))
      .map((habit) => habit.name);

    if (
      removed.length > 0 &&
      !window.confirm(
        `You have removed the following habits:\n${removed.join(
          ", "
        )}\n\nAll progress data for these will be lost. Are you sure you want to continue?`
      )
    ) {
      return;
    }

    const updatedHabits = initialHabits.map((habit) => {
      if (selected.includes(habit.name)) {
        return {
          ...habit,
          selected: true,
        };
      } else {
        return {
          ...habit,
          selected: false,
          todayProgress: 0,
          weeklyProgress: [],
          monthlyProgress: [],
        };
      }
    });

    onSave(updatedHabits);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 backdrop-blur-md flex justify-center items-center"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Habits</h2>

            <div className="grid grid-cols-1 gap-4">
              {initialHabits.map((habit) => (
                <label
                  key={habit.name}
                  className="flex items-center border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(habit.name)}
                    onChange={() => toggleHabit(habit.name)}
                    className="mr-4 w-5 h-5 accent-blue-600"
                  />
                  <div>
                    <p className="font-medium">
                      {habit.avatar} {habit.name}
                    </p>
                    <p className="text-sm text-gray-500">{habit.dailyGoal}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Save Selected Habits
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

const HabitsSection = ({
  onUpdate,
  habits,
}: {
  onUpdate: (updatedHabits: any[]) => void;
  habits: any[];
}) => {
  const [selected, setSelected] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Schedule habit reset at midnight
  useEffect(() => {
    const now = new Date();
    const millisTillMidnight =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1
      ).getTime() - now.getTime();

    const timer = setTimeout(() => {
      const todayKey = getTodayKey();
      const updatedHabits = habits.map((habit) => ({
        ...habit,
        weeklyProgress: [...habit.weeklyProgress, habit.todayProgress].slice(
          -7
        ),
        monthlyProgress: [...habit.monthlyProgress, habit.todayProgress].slice(
          -30
        ),
        todayProgress: 0,
      }));

      onUpdate(updatedHabits);
      localStorage.setItem("lastHabitUpdate", todayKey);
    }, millisTillMidnight);

    return () => clearTimeout(timer);
  }, [habits]);

  // Habit reset on refresh or if date changed
  useEffect(() => {
    const todayKey = getTodayKey();
    const lastUpdate = localStorage.getItem("lastHabitUpdate");

    if (lastUpdate !== todayKey && habits.length > 0) {
      const updatedHabits = habits.map((habit) => ({
        ...habit,
        todayProgress: 0,
        weeklyProgress: [...habit.weeklyProgress, habit.todayProgress].slice(
          -7
        ),
        monthlyProgress: [...habit.monthlyProgress, habit.todayProgress].slice(
          -30
        ),
      }));

      onUpdate(updatedHabits);
      localStorage.setItem("lastHabitUpdate", todayKey);
    }
  }, [habits]);

  const updateHabitProgress = (index: number, newProgress: number) => {
    const todayKey = getTodayKey();
    const lastUpdate = localStorage.getItem("lastHabitUpdate");

    const isSameDayUpdate = lastUpdate === todayKey;

    const updatedHabits = habits.map((habit, i) => {
      if (i !== index) return habit;

      const updatedWeekly = isSameDayUpdate
        ? [...habit.weeklyProgress.slice(0, -1), newProgress]
        : [...habit.weeklyProgress, newProgress].slice(-7);

      const updatedMonthly = isSameDayUpdate
        ? [...habit.monthlyProgress.slice(0, -1), newProgress]
        : [...habit.monthlyProgress, newProgress].slice(-30);

      return {
        ...habit,
        todayProgress: newProgress,
        weeklyProgress: updatedWeekly,
        monthlyProgress: updatedMonthly,
      };
    });

    onUpdate(updatedHabits);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden py-20 px-6 "
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl font-bold mb-10 text-gray-800 dark:text-white">
          Your Habit Journey
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          {(["Daily", "Weekly", "Monthly"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelected(type)}
              className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                selected === type
                  ? "bg-blue-100 text-black border border-black"
                  : "bg-white text-gray-700 hover:bg-blue-100 hover:text-black dark:bg-zinc-700 dark:text-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {habits.map((habit, index) => {
            const progress =
              selected === "Daily"
                ? habit.todayProgress
                : selected === "Weekly"
                ? habit.weeklyProgress.reduce((a:number, b:number) => a + b, 0)
                : habit.monthlyProgress.reduce((a:number, b:number) => a + b, 0);

            const limit =
              selected === "Daily"
                ? habit.limit
                : selected === "Weekly"
                ? habit.limit * 7
                : habit.limit * 30;

            return (
              habit.selected && (
                <HabitCard
                  key={index}
                  name={habit.name}
                  avatar={habit.avatar}
                  progress={progress}
                  limit={limit}
                  onProgressChange={(newProgress) =>
                    updateHabitProgress(index, newProgress)
                  }
                />
              )
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("All fields are required!");
      return;
    }

    // Create a mailto link with subject & body
    const mailtoLink = `mailto:arnavkul07@gmail.com?subject=Contact from ${encodeURIComponent(
      name
    )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    // Open user's default mail client
    window.location.href = mailtoLink;

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <footer className=" py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Contact Us
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Got a question, suggestion, or bug to report? Reach out — we’d love to
          hear from you!
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 max-w-lg mx-auto text-left"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-white"
          />
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Your Habit Tracker. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
