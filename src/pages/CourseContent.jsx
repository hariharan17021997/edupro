import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  useTheme,
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DownloadIcon from "@mui/icons-material/Download";
import CommonButton from "../components/CommonButton";
import CodeDisplay from "../components/CodeDisplay";

export default function CourseContent() {
  const theme = useTheme();

  const course = {
    id: 1,
    title: "React Fundamentals",
    instructor: {
      name: "Sarah Johnson",
      image: "SJ",
      rating: 4.9,
    },
    progress: 65,
    description:
      "Master the basics of React and build interactive UIs with modern JavaScript.",
    students: 1250,
    rating: 4.8,
  };

  const lessons = [
    {
      id: 1,
      title: "Introduction to React",
      duration: "15 mins",
      completed: true,
      type: "video",
    },
    {
      id: 2,
      title: "JSX and Components",
      duration: "20 mins",
      completed: true,
      type: "video",
    },
    {
      id: 3,
      title: "Props and State",
      duration: "25 mins",
      completed: true,
      type: "video",
    },
    {
      id: 4,
      title: "Hooks and Effects",
      duration: "30 mins",
      completed: false,
      type: "video",
      current: true,
    },
    {
      id: 5,
      title: "Component Lifecycle",
      duration: "22 mins",
      completed: false,
      type: "video",
    },
    {
      id: 6,
      title: "Quiz: React Basics",
      duration: "10 mins",
      completed: false,
      type: "quiz",
    },
  ];

  // Code examples for the current lesson
  const codeExamples = [
    {
      id: 1,
      title: "useState Hook Example",
      language: "javascript",
      code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`,
    },
    {
      id: 2,
      title: "useEffect Hook Example",
      language: "javascript",
      code: `import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when component mounts
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array = run once

  if (loading) return <p>Loading...</p>;
  
  return (
    <div>
      <h2>Data: {JSON.stringify(data)}</h2>
    </div>
  );
}

export default DataFetcher;`,
    },
    {
      id: 3,
      title: "Custom Hook Example",
      language: "javascript",
      code: `import { useState, useEffect } from 'react';

// Custom hook for window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage in component
function MyComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
    </div>
  );
}`,
    },
  ];

  const resources = [
    { id: 1, name: "React Documentation.pdf", size: "2.4 MB" },
    { id: 2, name: "Code Examples.zip", size: "5.1 MB" },
    { id: 3, name: "Cheat Sheet.pdf", size: "1.2 MB" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <Box sx={theme.custom.courseHeader}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {course.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
              {course.instructor.image}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {course.instructor.name}
              </Typography>
              <Rating value={course.instructor.rating} readOnly size="small" />
            </Box>
          </Box>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={`${course.students} Students`} variant="outlined" />
            <Chip label={`${course.rating}★ Rating`} color="primary" />
          </Box>
        </Box>
      </Box>

      {/* Progress Section */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Your Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={course.progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.palette.action.hover,
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {course.progress}% Complete
        </Typography>
      </Card>

      <Grid container spacing={3}>
        {/* Code Examples Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Code Examples - Hooks and Effects
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Learn by example! Study these code snippets to understand how React Hooks work.
              </Typography>
              {codeExamples.map((example) => (
                <CodeDisplay
                  key={example.id}
                  code={example.code}
                  language={example.language}
                  title={example.title}
                  showLineNumbers={true}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Lessons Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Course Lessons
              </Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                {lessons.map((lesson, index) => (
                  <Box
                    key={lesson.id}
                    sx={theme.custom.lessonItem}
                    style={{
                      borderLeft: lesson.current
                        ? `4px solid ${theme.palette.primary.main}`
                        : "4px solid transparent",
                      backgroundColor: lesson.current
                        ? theme.palette.action.hover
                        : "transparent",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        {lesson.completed ? (
                          <CheckCircleIcon
                            sx={{
                              fontSize: 28,
                              color: theme.palette.success.main,
                            }}
                          />
                        ) : lesson.type === "video" ? (
                          <PlayCircleIcon
                            sx={{
                              fontSize: 28,
                              color: theme.palette.primary.main,
                            }}
                          />
                        ) : (
                          <BookmarkIcon
                            sx={{
                              fontSize: 28,
                              color: theme.palette.warning.main,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {lesson.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {lesson.duration}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={
                        lesson.completed
                          ? "Completed"
                          : lesson.current
                          ? "Current"
                          : "Pending"
                      }
                      size="small"
                      color={
                        lesson.completed
                          ? "success"
                          : lesson.current
                          ? "primary"
                          : "default"
                      }
                      variant={
                        lesson.completed || lesson.current
                          ? "filled"
                          : "outlined"
                      }
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Video Player */}
          <Card sx={{ mb: 3, overflow: "hidden" }}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayCircleIcon
                sx={{
                  fontSize: 64,
                  color: theme.palette.primary.main,
                  opacity: 0.7,
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Now Playing: Hooks and Effects
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                30 minutes
              </Typography>
              <CommonButton variant="contained" fullWidth>
                Continue Watching
              </CommonButton>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Course Resources
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {resources.map((resource) => (
                  <Box
                    key={resource.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: theme.palette.action.hover,
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resource.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {resource.size}
                      </Typography>
                    </Box>
                    <DownloadIcon
                      sx={{
                        color: theme.palette.primary.main,
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
