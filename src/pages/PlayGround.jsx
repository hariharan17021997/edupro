import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const defaultQuestions = [
  { id: 1, title: "Hello World", snippet: "console.log('Hello, world!');" },
  {
    id: 2,
    title: "Sum Function",
    snippet: "function sum(a,b){return a+b;} console.log(sum(2,3));",
  },
  {
    id: 3,
    title: "Current Time",
    snippet: "console.log(new Date().toString());",
  },
];

function QuestionsWidget({ codeSetter, onDragStart }) {
  return (
    <Box sx={{ p: 1 }}>
      <List dense>
        {defaultQuestions.map((q) => (
          <ListItem
            key={q.id}
            button
            onClick={() => codeSetter(q.snippet)}
            draggable
            onDragStart={(e) =>
              onDragStart(e, { type: "question", payload: q })
            }
          >
            <ListItemText
              primary={q.title}
              secondary={
                q.snippet.slice(0, 60) + (q.snippet.length > 60 ? "..." : "")
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function EditorWidget({ code, setCode, onDropSnippet }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropSnippet(e)}
    >
      <Box sx={{ flex: 1, p: 1, display: "flex", flexDirection: "column" }}>
        <textarea
          style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            fontFamily: "monospace",
            fontSize: 14,
            padding: 8,
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            backgroundColor: "#fafafa",
            color: "#333",
            // resize: "none",
            outline: "none",
          }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </Box>
    </Box>
  );
}

function OutputWidget({ output }) {
  return (
    <Box
      sx={{
        p: 1,
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        wordBreak: "break-word",
        fontFamily: "monospace",
        fontSize: 13,
      }}
    >
      {output || (
        <Typography color="text.secondary">(No output yet)</Typography>
      )}
    </Box>
  );
}

export default function PlayGround() {
  // widget layout mapping: left, rightTop, rightBottom -> one of 'questions'|'editor'|'output'
  const [layout, setLayout] = useState({
    left: "questions",
    rightTop: "editor",
    rightBottom: "output",
  });

  // sizes
  const [leftPct, setLeftPct] = useState(25); // left pane width percent
  const [topPct, setTopPct] = useState(60); // top pane height percent of right area

  // dragging for resize
  const draggingVert = useRef(false);
  const draggingHoriz = useRef(false);

  // content states
  const [code, setCode] = useState(
    "// write your JS here\nconsole.log('run the code');"
  );
  const [output, setOutput] = useState("");

  // mobile breakpoint
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width:600px)").matches;

  // resize handlers
  useEffect(() => {
    const onMove = (e) => {
      if (draggingVert.current) {
        const total = window.innerWidth;
        const newLeft = (e.clientX / total) * 100;
        if (newLeft > 10 && newLeft < 80) setLeftPct(newLeft);
      }
      if (draggingHoriz.current) {
        const rightTopEl = document.getElementById("right-area");
        if (!rightTopEl) return;
        const rect = rightTopEl.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const newTopPct = (y / rect.height) * 100;
        if (newTopPct > 10 && newTopPct < 90) setTopPct(newTopPct);
      }
    };
    const onUp = () => {
      draggingVert.current = false;
      draggingHoriz.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startVert = (e) => {
    draggingVert.current = true;
  };
  const startHoriz = (e) => {
    draggingHoriz.current = true;
  };

  // Get display name for widget type
  const getWidgetLabel = (type) => {
    const labels = {
      questions: "Questions",
      editor: "Editor",
      output: "Output",
    };
    return labels[type] || type;
  };

  // drag to swap widgets
  const onDragStartWidget = (e, widgetKey) => {
    e.dataTransfer.setData("text/plain", widgetKey);
  };

  const onDropWidget = (e, targetKey) => {
    e.preventDefault();
    const src = e.dataTransfer.getData("text/plain");
    if (!src || src === targetKey) return;
    // swap
    setLayout((prev) => {
      const next = { ...prev };
      const tmp = next[src];
      next[src] = next[targetKey];
      next[targetKey] = tmp;
      return next;
    });
  };

  // helper to render widget by type
  const renderWidget = (type) => {
    if (type === "questions")
      return (
        <QuestionsWidget
          codeSetter={(s) => setCode(s)}
          onDragStart={(e, p) => {
            e.dataTransfer.setData(
              "question-snippet",
              JSON.stringify(p.payload)
            );
          }}
        />
      );
    if (type === "editor")
      return (
        <EditorWidget
          code={code}
          setCode={setCode}
          onDropSnippet={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData("question-snippet");
            if (raw) {
              try {
                const obj = JSON.parse(raw);
                setCode((c) => (c ? c + "\n" + obj.snippet : obj.snippet));
              } catch (e) {}
            }
          }}
        />
      );
    if (type === "output") return <OutputWidget output={output} />;
    return null;
  };

  const runCode = () => {
    // capture console
    const logs = [];
    const fakeConsole = {
      log: (...args) => logs.push(args.map((a) => String(a)).join(" ")),
      error: (...args) => logs.push("ERROR: " + args.join(" ")),
    };
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs.join("\n"));
    } catch (err) {
      setOutput(String(err));
    }
  };

  // layout positions
  return (
    <Box
      sx={{
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 1,
      }}
    >
      {/* Left pane */}
      <Box
        sx={{
          width: isMobile ? "100%" : `${leftPct}%`,
          minWidth: isMobile ? "auto" : 120,
          backgroundColor: "#f7f7f7",
          display: "flex",
          flexDirection: "column",
          borderRadius: 1,
          overflow: "hidden",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDropWidget(e, "left")}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1,
            background: "#eee",
            cursor: "grab",
          }}
          draggable
          onDragStart={(e) => onDragStartWidget(e, "left")}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DragIndicatorIcon fontSize="small" />
            <Typography variant="subtitle2">
              {getWidgetLabel(layout.left)}
            </Typography>
          </Box>
          <Box>
            {layout.left === "editor" && (
              <Button
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={runCode}
              >
                Run
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {renderWidget(layout.left)}
        </Box>
      </Box>

      {/* Vertical splitter */}
      {!isMobile && (
        <Box
          sx={{ width: 6, cursor: "col-resize", bgcolor: "#eee" }}
          onMouseDown={startVert}
        />
      )}

      {/* Right area */}
      <Box
        id="right-area"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            height: isMobile ? "50%" : `${topPct}%`,
            backgroundColor: "#fafafa",
            borderRadius: 1,
            overflow: "auto",
            flexShrink: 0,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropWidget(e, "rightTop")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              background: "#eee",
              cursor: "grab",
            }}
            draggable
            onDragStart={(e) => onDragStartWidget(e, "rightTop")}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DragIndicatorIcon fontSize="small" />
              <Typography variant="subtitle2">
                {getWidgetLabel(layout.rightTop)}
              </Typography>
            </Box>
            <Box>
              {layout.rightTop === "editor" && (
                <Button
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={runCode}
                >
                  Run
                </Button>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderWidget(layout.rightTop)}
          </Box>
        </Box>

        {/* Horizontal splitter */}
        {!isMobile && (
          <Box
            sx={{ height: 6, cursor: "row-resize", bgcolor: "#eee" }}
            onMouseDown={startHoriz}
          />
        )}

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropWidget(e, "rightBottom")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              background: "#eee",
              cursor: "grab",
              flexShrink: 0,
            }}
            draggable
            onDragStart={(e) => onDragStartWidget(e, "rightBottom")}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DragIndicatorIcon fontSize="small" />
              <Typography variant="subtitle2">
                {getWidgetLabel(layout.rightBottom)}
              </Typography>
            </Box>
            <Box>
              {layout.rightBottom === "editor" && (
                <Button
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={runCode}
                >
                  Run
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ flex: 1, p: 1, overflow: "auto" }}>
            {renderWidget(layout.rightBottom)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
