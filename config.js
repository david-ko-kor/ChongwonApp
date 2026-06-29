window.PROMPT_APP_CONFIG = {
  title: "미래의 나 문장 만들기",
  steps: [
    {
      id: "character",
      title: "미래의 나는 어떤 모습인가요?",
      help: "마음에 드는 캐릭터를 하나 골라요.",
      options: [
        {
          value: "rabbit",
          label: "토끼",
          image: "assets/animals/토끼.png",
          prompt: "밝고 친근한 토끼 캐릭터",
        },
        {
          value: "panda",
          label: "판다",
          image: "assets/animals/판다.png",
          prompt: "밝고 친근한 판다 캐릭터",
        },
        {
          value: "lion",
          label: "사자",
          image: "assets/animals/사자.png",
          prompt: "밝고 친근한 사자 캐릭터",
        },
        {
          value: "penguin",
          label: "펭귄",
          image: "assets/animals/펭귄.png",
          prompt: "밝고 친근한 펭귄 캐릭터",
        },
        {
          value: "fox",
          label: "여우",
          image: "assets/animals/여우.png",
          prompt: "밝고 친근한 여우 캐릭터",
        },
      ],
    },
    {
      id: "currentState",
      title: "지금 나는 어떤 느낌인가요?",
      help: "지금 내 마음과 가까운 그림을 골라요.",
      options: [
        {
          value: "happy",
          label: "기분이 좋아요",
          image: "assets/cards/freelaugh.png",
          prompt: "현재의 즐거운 마음을 이어서",
        },
        {
          value: "calm",
          label: "편안해요",
          image: "assets/cards/relex.png",
          prompt: "현재의 편안한 마음을 존중하며",
        },
        {
          value: "nervous",
          label: "조금 긴장돼요",
          image: "assets/cards/nerverse.png",
          prompt: "현재 조금 긴장되어 있지만 안심할 수 있도록",
        },
        {
          value: "help",
          label: "도움이 필요해요",
          image: "assets/cards/help.png",
          prompt: "필요한 도움을 편안하게 받으면서",
        },
      ],
    },
    {
      id: "place",
      title: "미래의 나는 어디에 있나요?",
      help: "일하고 싶은 장소를 하나 골라요.",
      options: [
        {
          value: "library",
          label: "도서관",
          image: "assets/cards/libro.jpg",
          prompt: "밝고 정돈된 도서관",
        },
        {
          value: "cafe",
          label: "카페",
          image: "assets/cards/cafe.jpg",
          prompt: "깨끗하고 따뜻한 카페",
        },
        {
          value: "office",
          label: "사무실",
          image: "assets/cards/office.png",
          prompt: "밝고 편안한 사무실",
        },
        {
          value: "outdoor",
          label: "야외 공간",
          image: "assets/cards/tomatto.jpg",
          prompt: "햇빛이 비치는 안전한 야외 공간",
        },
        {
          value: "studio",
          label: "디자인 작업실",
          image: "assets/cards/painting2.jpg",
          prompt: "색과 그림 도구가 있는 디자인 작업실",
        },
        {
          value: "animal",
          label: "동물 돌봄 공간",
          image: "assets/cards/raniramli-ai-generated-8520392_1920.png",
          prompt: "깨끗한 동물 돌봄 공간",
        },
      ],
    },
    {
      id: "activity",
      title: "미래의 나는 무엇을 하고 있나요?",
      help: "해보고 싶은 일을 하나 골라요.",
      options: [
        {
          value: "bake",
          label: "빵 만들기",
          image: "assets/activities/istockphoto-1225037151-1024x1024.jpg",
          prompt: "빵을 만들고 정성스럽게 포장하는",
        },
        {
          value: "animal_care",
          label: "동물 돌보기",
          image: "assets/activities/animal.jpg",
          prompt: "동물에게 먹이를 주고 편안하게 돌보는",
        },
        {
          value: "library",
          label: "책 정리하기",
          image: "assets/activities/book1.jpg",
          prompt: "책을 분류하고 선반에 가지런히 정리하는",
        },
        {
          value: "design",
          label: "그림 디자인하기",
          image: "assets/activities/bob.jpg",
          prompt: "컴퓨터와 그림 도구로 캐릭터를 디자인하는",
        },
        {
          value: "display",
          label: "상품 진열하기",
          image: "assets/activities/product001.jpg",
          prompt: "상품을 종류별로 보기 좋게 진열하는",
        },
        {
          value: "office",
          label: "자료 정리하기",
          image: "assets/activities/post.jpg",
          prompt: "컴퓨터로 자료와 파일을 차분하게 정리하는",
        },
      ],
    },
    {
      id: "futureMood",
      title: "미래의 나는 어떤 표정이면 좋을까요?",
      help: "원하는 미래의 기분을 골라요.",
      options: [
        {
          value: "happy",
          label: "즐거운 모습",
          image: "assets/cards/freelaugh.png",
          prompt: "즐겁게 웃는 표정",
        },
        {
          value: "calm",
          label: "편안한 모습",
          image: "assets/cards/relex.png",
          prompt: "편안하고 안정된 표정",
        },
        {
          value: "focus",
          label: "집중하는 모습",
          image: "assets/cards/focusOn.jpg",
          prompt: "차분하게 집중하는 표정",
        },
        {
          value: "confident",
          label: "자신 있는 모습",
          image: "assets/cards/confidont.png",
          prompt: "도움을 잘 활용하며 자신감 있는 표정",
        },
      ],
    },
    {
      id: "style",
      title: "어떤 그림으로 만들까요?",
      help: "마음에 드는 그림 느낌을 골라요.",
      options: [
        {
          value: "flat",
          label: "만화 스타일",
          image: "assets/cards/mario.png",
          prompt: "따뜻하고 선명한 2D 교육용 일러스트",
        },
        // {
        //   value: "3d",
        //   label: "부드러운 3D",
        //   image: "assets/cards/style-3d.svg",
        //   prompt: "부드럽고 친근한 3D 애니메이션",
        // },
        {
          value: "watercolor",
          label: "밝은 수채화",
          image: "assets/cards/draw2.png",
          prompt: "밝고 부드러운 수채화 그림",
        },
      ],
    },
  ],
};
