(function () {
  "use strict";
  const cfg = window.PROMPT_APP_CONFIG;
  const $ = (id) => document.getElementById(id);
  const screens = [
    "home",
    "introForm",
    "introResult",
    "futureWelcome",
    "picker",
    "futureResult",
    "copyPractice",
    "securityTest",
  ];
  let stepIndex = 0;
  let practiceIndex = 0;
  let practiceSelected = false;
  let practiceCopied = false;
  let favoriteChoice = "";
  const answers = {};
  const practiceItems = [
    {
      text: "안녕",
      mode: "select",
      guide: "짧은 글자예요. 글자 전체를 드래그해요.",
    },
    { text: "청원학교", mode: "select", guide: "청원학교를 드래그 해주세요." },
    {
      text: "바리스타",
      mode: "select",
      guide: ".",
    },
    {
      text: "오늘의 점심메뉴는 무엇인가요?",
      mode: "select",
      guide: "문장 전체를 드래그 해주세요",
    },
    {
      text: "미래의 나",
      mode: "copy",
      guide: "드래그한 다음 Ctrl+C를 눌러 복사해요.",
    },
    {
      text: "바리스타는 어떤 일을 하나요?",
      mode: "copy",
      guide: "질문 문장을 드래그한 다음 Ctrl+C를 눌러요.",
    },
    {
      text: "저는 카페에서 일하고 싶어요.",
      mode: "copy",
      guide: "긴 문장을 드래그한 다음 Ctrl+C를 눌러요.",
    },
    {
      text: "금쪽이 스피커야",
      mode: "paste",
      guide: "드래그하고 Ctrl+C를 누른 뒤 아래 칸에 Ctrl+V로 붙여넣어요.",
    },
    {
      text: "금쪽이 스피커야, 바리스타는 어떤 일을 해?",
      mode: "paste",
      guide: "긴 질문을 복사해서 아래 칸에 붙여넣어요.",
    },
    {
      text: "금쪽이 스피커야, 오늘 내가 연습할 일을 알려줘.",
      mode: "paste",
      guide: "마지막 긴 문장을 복사하고 붙여넣어요.",
    },
  ];

  function show(id) {
    screens.forEach((name) => $(name).classList.toggle("hidden", name !== id));
    $("homeButton").classList.toggle("hidden", id === "home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function html(value) {
    return String(value).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }

  async function copyText(text, statusId, successMessage) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (error) {
      const temporary = document.createElement("textarea");
      temporary.value = text;
      document.body.appendChild(temporary);
      temporary.select();
      try {
        ok = document.execCommand("copy");
      } catch (copyError) {
        ok = false;
      }
      temporary.remove();
    }
    $(statusId).textContent = ok
      ? successMessage
      : "자동 복사가 어려워요. 문장을 길게 눌러 복사해 주세요.";
  }

  function saveText(text, filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 800);
  }

  function renderPractice() {
    const current = practiceItems[practiceIndex];
    $("practiceStepText").textContent =
      `${practiceIndex + 1} / ${practiceItems.length} 단계`;
    $("practiceTarget").textContent = current.text;
    $("practiceGuide").textContent = current.guide;
    $("practiceInput").value = "";
    practiceSelected = false;
    practiceCopied = false;
    $("practiceNextButton").disabled = true;
    $("practiceInputArea").classList.toggle("hidden", current.mode !== "paste");
    $("practiceStatus").textContent =
      current.mode === "select"
        ? "글자를 드래그해요. 맞게 드래그하면 자동으로 알려줘요."
        : current.mode === "copy"
          ? "글자를 드래그한 다음 Ctrl+C를 눌러요."
          : "글자를 드래그하고 Ctrl+C를 누른 다음, 아래 칸에 Ctrl+V로 붙여넣어요.";
    $("practiceStatus").classList.remove("success");
  }

  function selectedPracticeText() {
    return window.getSelection().toString().replace(/\s+/g, " ").trim();
  }

  function checkPracticeSelection() {
    const current = practiceItems[practiceIndex];
    const expected = current.text.trim();
    if (selectedPracticeText() === expected) {
      if (practiceSelected) return;
      practiceSelected = true;
      $("practiceStatus").textContent =
        current.mode === "select"
          ? "잘했어요! 드래그가 되었어요. 다음 단계로 가도 좋아요."
          : "좋아요. 이제 키보드에서 Ctrl+C를 눌러요.";
      $("practiceStatus").classList.add("success");
      if (current.mode === "select") {
        $("practiceNextButton").disabled = false;
      }
    } else if (selectedPracticeText()) {
      practiceSelected = false;
      $("practiceStatus").textContent =
        "아직 글자 전체가 지정되지 않았어요. 글자를 처음부터 끝까지 드래그해요.";
      $("practiceStatus").classList.remove("success");
    }
  }

  function checkPracticeText() {
    const expected = practiceItems[practiceIndex].text.trim();
    const actual = $("practiceInput").value.trim();
    if (actual === expected) {
      $("practiceStatus").textContent = "잘했어요! 같은 글자가 들어왔어요.";
      $("practiceStatus").classList.add("success");
      $("practiceNextButton").disabled = false;
    } else {
      $("practiceStatus").textContent =
        "아직 달라요. 다시 복사하고 붙여넣어 볼까요?";
      $("practiceStatus").classList.remove("success");
      $("practiceNextButton").disabled = true;
    }
  }

  function nextPractice() {
    practiceIndex = (practiceIndex + 1) % practiceItems.length;
    renderPractice();
  }

  function handlePracticeShortcut(event) {
    if ($("copyPractice").classList.contains("hidden")) return;
    const key = event.key.toLowerCase();
    const shortcut = event.ctrlKey || event.metaKey;
    if (!shortcut) return;
    if (key === "c" && practiceSelected) {
      practiceCopied = true;
      $("practiceStatus").textContent =
        practiceItems[practiceIndex].mode === "paste"
          ? "Ctrl+C를 눌렀어요. 이제 아래 칸을 누르고 Ctrl+V를 눌러요."
          : "Ctrl+C를 눌렀어요. 다음 단계로 가도 좋아요.";
      $("practiceStatus").classList.add("success");
      if (practiceItems[practiceIndex].mode === "copy") {
        $("practiceNextButton").disabled = false;
      }
    }
    if (key === "v") {
      setTimeout(() => {
        if ($("practiceInput").value.trim()) {
          checkPracticeText();
        }
      }, 50);
    }
  }

  function securityFindings() {
    const text = $("securityInput").value.trim();
    const findings = [];
    const rules = [
      {
        name: "전화번호",
        message: "전화번호는 다른 사람이 연락할 수 있는 개인정보예요.",
        test: /01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/,
      },
      {
        name: "이메일",
        message: "이메일 주소는 로그인이나 연락에 쓰일 수 있어요.",
        test: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      },
      {
        name: "비밀번호",
        message: "비밀번호는 절대 AI에 넣지 않아요.",
        test:
          /(비밀번호|비번|password|passcode|pw)\s*[:은는]?\s*\S{4,}|(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{6,}/i,
      },
      {
        name: "주소",
        message: "자세한 주소는 집이나 학교 위치를 알 수 있어요.",
        test:
          /(주소|사는 곳|살아요|아파트|빌라|원룸|동\s?\d+|호\s?\d+|번지|도로명|원주시|서울|부산|대구|인천|광주|대전|울산|세종|경기도|강원도|충청|전라|경상|제주).*(동|아파트|빌라|원룸|호|로|길|번지)?/,
      },
      {
        name: "이름",
        message: "실명은 AI에 넣기 전에 선생님과 먼저 확인해요.",
        test:
          /(이름|실명|본명)\s*(은|는|:)?\s*[가-힣]{2,5}|저는\s*[가-힣]{2,4}(입니다|이에요|예요)/,
      },
    ];

    rules.forEach((rule) => {
      if (rule.test.test(text)) findings.push(rule);
    });

    if ($("securityPhoto").files.length) {
      findings.push({
        name: "사진",
        message: "사진에는 얼굴, 교복, 장소가 보일 수 있어요.",
      });
    }

    return { text, findings };
  }

  function renderSecurityResult() {
    const { text, findings } = securityFindings();
    const hasPhoto = $("securityPhoto").files.length > 0;
    $("securityResult").classList.remove("safe", "danger", "neutral");

    if (!text && !hasPhoto) {
      $("securityResult").classList.add("neutral");
      $("securityResultIcon").textContent = "?";
      $("securityResultTitle").textContent = "아직 확인하지 않았어요";
      $("securityResultText").textContent =
        "왼쪽 칸에 문장을 넣고 확인하기를 눌러요.";
      $("securityReasonList").innerHTML = "";
      return;
    }

    if (findings.length) {
      $("securityResult").classList.add("danger");
      $("securityResultIcon").textContent = "!";
      $("securityResultTitle").textContent = "경고! 멈춰요";
      $("securityResultText").textContent =
        "AI에 넣으면 위험할 수 있는 정보가 보여요.";
      $("securityReasonList").innerHTML = findings
        .map((item) => `<li><strong>${html(item.name)}</strong><span>${html(item.message)}</span></li>`)
        .join("");
      return;
    }

    $("securityResult").classList.add("safe");
    $("securityResultIcon").textContent = "✓";
    $("securityResultTitle").textContent = "좋아요. 개인정보가 보이지 않아요";
    $("securityResultText").textContent =
      "좋아하는 것, 하고 싶은 일처럼 일반적인 내용은 비교적 안전해요.";
    $("securityReasonList").innerHTML =
      "<li><strong>안전</strong><span>그래도 AI에 넣기 전에는 한 번 더 읽어봐요.</span></li>";
  }

  function resetSecurityTest() {
    $("securityInput").value = "";
    $("securityPhoto").value = "";
    renderSecurityResult();
    $("securityInput").focus();
  }

  function makeIntro() {
    const name = $("introName").value.trim();
    const grade = $("introGrade").value;
    const region = $("introRegion").value.trim();
    const typedFavorite = $("introFavorite").value.trim();
    const favorite = typedFavorite || favoriteChoice;
    const job = $("introJob").value.trim();
    if (!name) {
      $("introFormStatus").textContent = "이름 또는 별명을 써 주세요.";
      $("introName").focus();
      return;
    }
    const information = [`별명 또는 이름: ${name}`];
    if (grade) information.push(`학년: ${grade}`);
    if (favorite) information.push(`좋아하는 것: ${favorite}`);
    if (job) information.push(`해보고 싶은 일: ${job}`);
    $("introText").value = [
      "다음 정보를 이용하여 고등학생의 자기소개를 만들어 주세요.",
      "쉬운 말과 짧은 문장으로 4문장만 작성해 주세요.",
      "학생이 입력하지 않은 내용은 새로 만들지 마세요.",
      "학생을 존중하는 표현을 사용하고, 과장하거나 어린아이처럼 표현하지 마세요.",
      "자기소개 문장만 답해 주세요.",
      "",
      ...information,
    ].join("\n");
    const sentences = [`안녕하세요. 저는 ${name}입니다.`];
    if (grade) sentences.push(`저는 ${grade}입니다.`);
    if (region) sentences.push(`저는 ${region}에 살고 있습니다.`);
    if (favorite) sentences.push(`제가 좋아하는 것은 ${favorite}입니다.`);
    if (job) sentences.push(`저는 앞으로 ${job}를 해보고 싶습니다.`);
    $("fallbackIntroText").value = sentences.join(" ");
    $("introFormStatus").textContent = "";
    $("introCopyStatus").textContent = "";
    show("introResult");
  }

  function step() {
    return cfg.steps[stepIndex];
  }
  function optionByValue(s, value) {
    return s.options.find((option) => option.value === value);
  }
  function chosen(s) {
    return optionByValue(s, answers[s.id]);
  }

  function renderStep() {
    const current = step();
    $("questionTitle").textContent = current.title;
    $("questionHelp").textContent = current.help;
    $("progressText").textContent = `${stepIndex + 1} / ${cfg.steps.length}`;
    $("progressBar").style.width =
      `${((stepIndex + 1) / cfg.steps.length) * 100}%`;
    const host = $("options");
    host.innerHTML = "";
    current.options.forEach((option) => {
      const button = document.createElement("button");
      const selected = answers[current.id] === option.value;
      button.type = "button";
      button.className = `option${selected ? " selected" : ""}`;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.innerHTML = `<img src="${html(option.image)}" alt=""><span>${html(option.label)}</span>`;
      button.onclick = () => {
        answers[current.id] = option.value;
        renderStep();
      };
      host.appendChild(button);
    });
    $("prevButton").disabled = stepIndex === 0;
    $("nextButton").disabled = !answers[current.id];
    $("nextButton").textContent =
      stepIndex === cfg.steps.length - 1 ? "AI 문장 만들기" : "다음";
  }

  function makeFuturePrompt() {
    const fallback = {
      character: "한국의 고등학생 캐릭터",
      currentState: "현재 마음을 편안하게 존중하며",
      place: "밝고 안전한 일하는 공간",
      activity: "관심 있는 일을 하는",
      futureMood: "편안하고 자신 있는 표정",
      style: "따뜻하고 선명한 2D 교육용 일러스트",
    };
    const value = (id) => {
      const item = cfg.steps.find((candidate) => candidate.id === id);
      return chosen(item)?.prompt || fallback[id];
    };
    return `${value("currentState")}, 미래의 나를 표현해 주세요. ${value("character")}가 ${value("place")}에서 ${value("activity")} 모습입니다. ${value("futureMood")}으로 표현하고, ${value("style")} 스타일로 만들어 주세요. 고등학생에게 알맞고 존중감 있게 표현하며, 배경은 단순하게 해 주세요. 그림 안에 글자, 로고, 워터마크는 넣지 마세요.`;
  }

  function makeSpeakerQuestionSet() {
    const activity = answers.activity;
    const place = answers.place;
    const sets = {
      bake: {
        job: "제빵사",
        questions: [
          "제빵사는 어떤 일을 해?",
          "빵을 만들 때 어떤 도구를 사용해?",
          "빵을 만들 때 조심할 것은 뭐야?",
          "제빵사가 되려면 무엇을 연습하면 좋아?",
          "제빵사 일을 쉬운 말로 설명해 줘.",
        ],
      },
      drink: {
        job: "바리스타",
        questions: [
          "바리스타는 어떤 일을 해?",
          "음료를 만들 때 어떤 도구를 사용해?",
          "카페에서 손님에게 어떻게 말하면 좋아?",
          "카페에서 조심할 것은 뭐야?",
          "바리스타가 되려면 무엇을 연습하면 좋아?",
        ],
      },
      animal_care: {
        job: "동물 돌봄 도우미",
        questions: [
          "동물 돌봄 도우미는 어떤 일을 해?",
          "동물에게 먹이를 줄 때 조심할 것은 뭐야?",
          "동물 돌봄 공간에서는 어떤 도구를 사용해?",
          "동물 돌봄 일을 하려면 무엇을 연습하면 좋아?",
          "동물 돌봄 도우미 일을 쉬운 말로 설명해 줘.",
        ],
      },
      library: {
        job: "도서관 정리 보조",
        questions: [
          "도서관 정리 보조는 어떤 일을 해?",
          "책을 정리할 때 어떤 순서로 하면 좋아?",
          "도서관에서 지켜야 할 약속은 뭐야?",
          "도서관 정리 일을 하려면 무엇을 연습하면 좋아?",
          "도서관 정리 보조 일을 쉬운 말로 설명해 줘.",
        ],
      },
      design: {
        job: "디자이너",
        questions: [
          "디자이너는 어떤 일을 해?",
          "그림 디자인을 할 때 먼저 정할 것은 뭐야?",
          "디자이너가 사용하는 도구는 무엇이 있어?",
          "디자이너가 되려면 무엇을 연습하면 좋아?",
          "디자이너 일을 쉬운 말로 설명해 줘.",
        ],
      },
      display: {
        job: "상품 진열원",
        questions: [
          "상품 진열원은 어떤 일을 해?",
          "상품을 보기 좋게 놓으려면 어떻게 하면 좋아?",
          "상품을 정리할 때 조심할 것은 뭐야?",
          "상품 진열 일을 하려면 무엇을 연습하면 좋아?",
          "상품 진열원 일을 쉬운 말로 설명해 줘.",
        ],
      },
      office: {
        job: "사무 보조",
        questions: [
          "사무 보조는 어떤 일을 해?",
          "자료를 정리할 때 어떤 순서로 하면 좋아?",
          "컴퓨터로 자료를 입력할 때 조심할 것은 뭐야?",
          "사무 보조 일을 하려면 무엇을 연습하면 좋아?",
          "사무 보조 일을 쉬운 말로 설명해 줘.",
        ],
      },
      cafe: {
        job: "바리스타",
        questions: [
          "바리스타는 어떤 일을 해?",
          "카페에서 손님에게 어떻게 말하면 좋아?",
          "바리스타가 사용하는 도구는 무엇이 있어?",
          "음료를 만들 때 가장 중요한 순서는 뭐야?",
          "바리스타 일을 쉬운 말로 설명해 줘.",
        ],
      },
      animal: {
        job: "동물 돌봄 도우미",
        questions: [
          "동물 돌봄 도우미는 어떤 일을 해?",
          "동물에게 먹이를 줄 때 조심할 것은 뭐야?",
          "동물 돌봄 공간에서는 어떤 도구를 사용해?",
          "동물 돌봄 일을 하려면 무엇을 연습하면 좋아?",
          "동물 돌봄 도우미 일을 쉬운 말로 설명해 줘.",
        ],
      },
      studio: {
        job: "디자이너",
        questions: [
          "디자이너는 어떤 일을 해?",
          "그림 디자인을 할 때 먼저 정할 것은 뭐야?",
          "디자이너가 사용하는 도구는 무엇이 있어?",
          "디자이너가 되려면 무엇을 연습하면 좋아?",
          "디자이너 일을 쉬운 말로 설명해 줘.",
        ],
      },
      outdoor: {
        job: "원예 보조",
        questions: [
          "원예 보조는 어떤 일을 해?",
          "식물을 돌볼 때 어떤 도구를 사용해?",
          "밖에서 일할 때 조심할 것은 뭐야?",
          "원예 보조 일을 하려면 무엇을 연습하면 좋아?",
          "원예 보조 일을 쉬운 말로 설명해 줘.",
        ],
      },
    };
    return (
      sets[activity] ||
      sets[place] || {
        job: "미래의 직업",
        questions: [
          "이 직업은 어떤 일을 해?",
          "이 일을 할 때 필요한 도구는 뭐야?",
          "이 일을 할 때 조심할 것은 뭐야?",
          "이 일을 하려면 무엇을 연습하면 좋아?",
          "이 직업을 쉬운 말로 설명해 줘.",
        ],
      }
    );
  }

  function showFutureResult() {
    const selected = cfg.steps
      .map((item) => ({ item, option: chosen(item) }))
      .filter((entry) => entry.option);
    $("summary").innerHTML = selected
      .map(
        (entry) =>
          `<div class="summary-item"><img src="${html(entry.option.image)}" alt=""><strong>${html(entry.option.label)}</strong></div>`,
      )
      .join("");
    $("promptText").value = makeFuturePrompt();
    const speaker = makeSpeakerQuestionSet();
    $("speakerJobText").textContent =
      `${speaker.job}에 대해 AI 스피커에게 물어볼 질문입니다.`;
    $("speakerQuestions").innerHTML = speaker.questions
      .map((question) => `<li>${html(question)}</li>`)
      .join("");
    $("copyStatus").textContent = "";
    show("futureResult");
  }

  function nextStep() {
    if (stepIndex < cfg.steps.length - 1) {
      stepIndex += 1;
      renderStep();
    } else showFutureResult();
  }

  function skipStep() {
    answers[step().id] = null;
    if (stepIndex < cfg.steps.length - 1) {
      stepIndex += 1;
      renderStep();
    } else showFutureResult();
  }

  function importFirst(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.answers?.avatar) answers.character = data.answers.avatar;
        if (data.finalJob) {
          const activity = cfg.steps.find((item) => item.id === "activity");
          const match = activity.options.find(
            (option) => option.label === data.finalJob,
          );
          if (match) answers.activity = match.value;
          $("introJob").value = data.finalJob;
        }
        $("importStatus").textContent =
          "불러왔어요! 동물 친구와 직업활동이 먼저 선택됩니다.";
      } catch (error) {
        $("importStatus").textContent =
          "결과 파일을 읽지 못했어요. 선생님에게 도움을 요청하세요.";
      }
    };
    reader.readAsText(file);
  }

  $("introModeButton").onclick = () => show("introForm");
  $("futureModeButton").onclick = () => show("futureWelcome");
  $("copyPracticeModeButton").onclick = () => {
    practiceIndex = 0;
    show("copyPractice");
    renderPractice();
  };
  $("securityModeButton").onclick = () => {
    show("securityTest");
    renderSecurityResult();
  };
  $("homeButton").onclick = () => show("home");
  $("makeIntroButton").onclick = makeIntro;
  $("editIntroButton").onclick = () => show("introForm");
  $("copyIntroButton").onclick = () =>
    copyText(
      $("introText").value,
      "introCopyStatus",
      "복사했어요! 제미나이에 붙여넣으세요.",
    );
  $("saveIntroButton").onclick = () =>
    saveText($("introText").value, "제미나이_자기소개_질문.txt");
  $("copyFallbackButton").onclick = () =>
    copyText(
      $("fallbackIntroText").value,
      "fallbackCopyStatus",
      "복사했어요! 구글 홈페이지에 붙여넣으세요.",
    );

  $("favoriteChoices")
    .querySelectorAll("button")
    .forEach((button) => {
      button.onclick = () => {
        favoriteChoice = button.dataset.value;
        $("favoriteChoices")
          .querySelectorAll("button")
          .forEach((item) =>
            item.classList.toggle("selected", item === button),
          );
        if (!$("introFavorite").value.trim())
          $("introFavorite").placeholder = `선택: ${favoriteChoice}`;
      };
    });

  $("startButton").onclick = () => {
    stepIndex = 0;
    show("picker");
    renderStep();
  };
  $("prevButton").onclick = () => {
    if (stepIndex > 0) {
      stepIndex -= 1;
      renderStep();
    }
  };
  $("nextButton").onclick = nextStep;
  $("skipButton").onclick = skipStep;
  $("copyButton").onclick = () =>
    copyText(
      $("promptText").value,
      "copyStatus",
      "복사했어요! 생성형 AI에 붙여넣으세요.",
    );
  $("saveButton").onclick = () =>
    saveText($("promptText").value, "미래의_나_AI_문장.txt");
  $("restartFutureButton").onclick = () => {
    stepIndex = 0;
    show("picker");
    renderStep();
  };
  document.addEventListener("selectionchange", () => {
    if (!$("copyPractice").classList.contains("hidden")) {
      checkPracticeSelection();
    }
  });
  document.addEventListener("keydown", handlePracticeShortcut);
  $("practiceInput").addEventListener("input", checkPracticeText);
  $("practiceNextButton").onclick = nextPractice;
  $("securityCheckButton").onclick = renderSecurityResult;
  $("securityResetButton").onclick = resetSecurityTest;
  $("securityInput").addEventListener("input", renderSecurityResult);
  $("securityPhoto").addEventListener("change", renderSecurityResult);
  document
    .querySelectorAll(".security-example-grid button")
    .forEach((button) => {
      button.onclick = () => {
        $("securityInput").value = button.dataset.example;
        $("securityPhoto").value = "";
        renderSecurityResult();
      };
    });
  $("importResult").onchange = (event) => {
    if (event.target.files[0]) importFirst(event.target.files[0]);
  };
})();
