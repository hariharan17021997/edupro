import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Rating,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommonButton from "../components/CommonButton";

export default function About() {
  const theme = useTheme();
  // Featured courses
  const courses = [
    {
      id: 1,
      title: "React Fundamentals",
      description: "Master the basics of React and build interactive UIs",
      image: "🚀",
      level: "Beginner",
      students: 1250,
      rating: 4.8,
      price: "$49.99",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into ES6+ features and async programming",
      image: "⚡",
      level: "Intermediate",
      students: 980,
      rating: 4.9,
      price: "$59.99",
    },
    {
      id: 3,
      title: "Full Stack Development",
      description: "Build complete web applications from frontend to backend",
      image: "🌐",
      level: "Advanced",
      students: 756,
      rating: 4.7,
      price: "$79.99",
    },
    {
      id: 4,
      title: "UI/UX Design Basics",
      description: "Learn design principles and create beautiful interfaces",
      image: "🎨",
      level: "Beginner",
      students: 1100,
      rating: 4.6,
      price: "$39.99",
    },
  ];

  // Platform features
  const features = [
    {
      icon: (
        <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
    },
    {
      icon: (
        <GroupIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Community Support",
      description: "Join thousands of learners and get help when you need it",
    },
    {
      icon: (
        <EmojiEventsIcon
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
      title: "Certified Courses",
      description: "Earn recognized certificates upon course completion",
    },
    {
      icon: (
        <ThumbUpIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Lifetime Access",
      description: "Access course materials forever with lifetime access",
    },
  ];

  // Student testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Full Stack Developer",
      comment:
        "EduPro transformed my career. The courses are comprehensive and easy to follow!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "UI Designer",
      comment:
        "Excellent instructors and great community support. Highly recommended!",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emma Williams",
      role: "Junior Developer",
      comment:
        "The hands-on projects really helped me build a strong portfolio.",
      rating: 4.5,
      avatar: "EW",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to EduPro
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ mb: 3, maxWidth: 600, mx: "auto" }}
        >
          Your gateway to world-class education. Learn from experts, build
          projects, and advance your career with our comprehensive online
          courses.
        </Typography>
        <CommonButton variant="contained" size="large" sx={{ mr: 2 }}>
          Explore Courses
        </CommonButton>
        <CommonButton variant="outlined" size="large">
          Learn More
        </CommonButton>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 700, mb: 6 }}
        >
          Why Choose EduPro?
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {features.map((feature, index) => (
            <Grid item xs={12} sm={5} md={2.5} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: theme.palette.info.light,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Courses Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 700, mb: 4 }}
        >
          Featured Courses
        </Typography>
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={3} key={course.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 60,
                    backgroundColor: theme.palette.primary.light,
                    opacity: 0.1,
                    py: 3,
                    minHeight: 150,
                  }}
                >
                  {course.image}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={course.level}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {course.price}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {course.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Rating value={course.rating} readOnly size="small" />
                    <Typography variant="caption" color="textSecondary">
                      ({course.students} students)
                    </Typography>
                  </Box>
                  <CommonButton variant="contained" fullWidth size="small">
                    Enroll Now
                  </CommonButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 700, mb: 4 }}
        >
          What Our Students Say
        </Typography>
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  {testimonial.avatar}
                </Avatar>
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
                  "{testimonial.comment}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {testimonial.role}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              50K+
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active Students
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              200+
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Expert Courses
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              4.8★
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Average Rating
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              50+
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Countries
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
