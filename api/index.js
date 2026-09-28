// src/apiServer.ts
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// src/data/wizardData.ts
var FEATURE_CONFIGS = [
  {
    id: "quiz",
    name: "\uBB38\uC81C \uB9DE\uD788\uAE30 (\uD034\uC988)",
    category: "game",
    description: "OX \uD034\uC988\uB098 4\uC9C0\uC120\uB2E4\uD615\uC73C\uB85C \uC9C0\uC2DD\uC744 \uC2DC\uD5D8\uD574\uC694",
    iconName: "HelpCircle",
    suggestedQuestions: [
      {
        key: "questionType",
        question: "\uD034\uC988 \uBB38\uC81C\uC758 \uD615\uD0DC\uB294 \uBB34\uC5C7\uC778\uAC00\uC694?",
        type: "select",
        options: ["4\uC9C0\uC120\uB2E4 \uAC1D\uAD00\uC2DD", "OX \uCC2C\uBC18 \uD034\uC988", "\uC9C1\uC811 \uB2E8\uC5B4 \uC785\uB825 \uC8FC\uAD00\uC2DD", "\uD63C\uD569\uD615"],
        defaultValue: "4\uC9C0\uC120\uB2E4 \uAC1D\uAD00\uC2DD"
      },
      {
        key: "questionCount",
        question: "\uD55C \uAC8C\uC784\uB2F9 \uBA87 \uBB38\uC81C\uB97C \uD480\uAE4C\uC694?",
        type: "select",
        options: ["5\uBB38\uC81C", "10\uBB38\uC81C", "\uBB34\uC81C\uD55C (\uD2C0\uB9B4 \uB54C\uAE4C\uC9C0)"],
        defaultValue: "5\uBB38\uC81C"
      },
      {
        key: "timeLimit",
        question: "\uBB38\uC81C\uB2F9 \uC81C\uD55C \uC2DC\uAC04\uC774 \uC788\uB098\uC694?",
        type: "select",
        options: ["10\uCD08 \uCE74\uC6B4\uD2B8\uB2E4\uC6B4", "15\uCD08 \uCE74\uC6B4\uD2B8\uB2E4\uC6B4", "\uC81C\uD55C \uC2DC\uAC04 \uC5C6\uC74C"],
        defaultValue: "10\uCD08 \uCE74\uC6B4\uD2B8\uB2E4\uC6B4"
      }
    ]
  },
  {
    id: "timer",
    name: "\uD0C0\uC774\uBA38 / \uC2A4\uD1B1\uC6CC\uCE58",
    category: "utility",
    description: "\uC2DC\uAC04\uC744 \uC7AC\uAC70\uB098 \uC9D1\uC911 \uC2DC\uAC04\uC744 \uCE21\uC815\uD574\uC694",
    iconName: "Clock",
    suggestedQuestions: [
      {
        key: "timerMode",
        question: "\uC5B4\uB5A4 \uBC29\uC2DD\uC758 \uD0C0\uC774\uBA38\uAC00 \uD544\uC694\uD55C\uAC00\uC694?",
        type: "select",
        options: ["\uBF40\uBAA8\uB3C4\uB85C (25\uBD84 \uC9D1\uC911 + 5\uBD84 \uD734\uC2DD)", "\uCE74\uC6B4\uD2B8\uB2E4\uC6B4 \uD0C0\uC774\uBA38", "\uAE30\uB85D \uCE21\uC815 \uC2A4\uD1B1\uC6CC\uCE58"],
        defaultValue: "\uBF40\uBAA8\uB3C4\uB85C (25\uBD84 \uC9D1\uC911 + 5\uBD84 \uD734\uC2DD)"
      },
      {
        key: "alarmEffect",
        question: "\uC2DC\uAC04\uC774 \uB2E4 \uB418\uC5C8\uC744 \uB54C \uC5B4\uB5A4 \uC54C\uB9BC\uC744 \uC904\uAE4C\uC694?",
        type: "select",
        options: ["\uCD95\uD558 \uD6A8\uACFC\uC74C & \uD654\uBA74 \uBC18\uC9DD\uC784", "\uB9C8\uC2A4\uCF54\uD2B8\uC758 \uC751\uC6D0 \uBA54\uC2DC\uC9C0", "\uD654\uBA74 \uAC00\uB4DD \uCD95\uD558 \uD31D\uC5C5"],
        defaultValue: "\uCD95\uD558 \uD6A8\uACFC\uC74C & \uD654\uBA74 \uBC18\uC9DD\uC784"
      }
    ]
  },
  {
    id: "score",
    name: "\uC810\uC218 & \uCF64\uBCF4 \uC2DC\uC2A4\uD15C",
    category: "game",
    description: "\uC810\uC218\uAC00 \uC624\uB974\uACE0 \uC5F0\uC18D \uC131\uACF5 \uC2DC \uCF64\uBCF4 \uBCF4\uB108\uC2A4\uB97C \uC918\uC694",
    iconName: "Trophy",
    suggestedQuestions: [
      {
        key: "scoreRule",
        question: "\uC810\uC218\uB294 \uC5B4\uB5BB\uAC8C \uC62C\uB77C\uAC00\uB098\uC694?",
        type: "select",
        options: ["\uC131\uACF5\uD560 \uB54C\uB9C8\uB2E4 +100\uC810", "\uB0A8\uC740 \uC2DC\uAC04\uC5D0 \uBE44\uB840\uD558\uC5EC \uCD94\uAC00 \uC810\uC218", "\uC5F0\uC18D \uC131\uACF5 \uC2DC 2\uBC30, 3\uBC30 \uCF64\uBCF4"],
        defaultValue: "\uC5F0\uC18D \uC131\uACF5 \uC2DC 2\uBC30, 3\uBC30 \uCF64\uBCF4"
      },
      {
        key: "highestScore",
        question: "\uCD5C\uACE0 \uC810\uC218\uB97C \uAE30\uAE30\uC5D0 \uC800\uC7A5\uD560\uAE4C\uC694?",
        type: "select",
        options: ["\uB124, \uCD5C\uACE0 \uC810\uC218\uB97C \uAE30\uB85D\uD558\uACE0 \uCD95\uD558\uD574 \uC918\uC694", "\uC544\uB2C8\uC694, \uC774\uBC88 \uD310 \uC810\uC218\uB9CC \uBCF4\uC5EC\uC918\uC694"],
        defaultValue: "\uB124, \uCD5C\uACE0 \uC810\uC218\uB97C \uAE30\uB85D\uD558\uACE0 \uCD95\uD558\uD574 \uC918\uC694"
      }
    ]
  },
  {
    id: "todo",
    name: "\uD560 \uC77C \uCCB4\uD06C\uB9AC\uC2A4\uD2B8 (\uD22C\uB450)",
    category: "core",
    description: "\uD574\uC57C \uD560 \uC77C\uC744 \uCD94\uAC00\uD558\uACE0 \uD558\uB098\uC529 \uC644\uB8CC \uCCB4\uD06C\uD574\uC694",
    iconName: "CheckSquare",
    suggestedQuestions: [
      {
        key: "addMethod",
        question: "\uD560 \uC77C\uC740 \uC5B4\uB5BB\uAC8C \uB4F1\uB85D\uD558\uB098\uC694?",
        type: "select",
        options: ["\uC9C1\uC811 \uD14D\uC2A4\uD2B8 \uC785\uB825 + \uB9C8\uAC10 \uC2DC\uAC04", "\uAC04\uB2E8 \uD14D\uC2A4\uD2B8 \uC785\uB825\uB9CC", "\uCD94\uCC9C \uD560 \uC77C \uBC84\uD2BC \uD074\uB9AD\uC73C\uB85C \uCD94\uAC00"],
        defaultValue: "\uC9C1\uC811 \uD14D\uC2A4\uD2B8 \uC785\uB825 + \uB9C8\uAC10 \uC2DC\uAC04"
      },
      {
        key: "completeEffect",
        question: "\uCCB4\uD06C\uD588\uC744 \uB54C \uC5B4\uB5A4 \uC7AC\uBBF8\uB09C \uD6A8\uACFC\uB97C \uC904\uAE4C\uC694?",
        type: "select",
        options: ["\uC904 \uAE0B\uAE30 + \uBC18\uC9DD\uC774 \uD3ED\uC8FD \uC560\uB2C8\uBA54\uC774\uC158", "\uB9C8\uC2A4\uCF54\uD2B8\uAC00 \uC5C4\uC9C0 \uCC99 \uCE6D\uCC2C\uD558\uAE30", "\uACBD\uCF8C\uD55C \uB529\uB3D9 \uC18C\uB9AC\uC640 \uAC8C\uC774\uC9C0 \uC0C1\uC2B9"],
        defaultValue: "\uC904 \uAE0B\uAE30 + \uBC18\uC9DD\uC774 \uD3ED\uC8FD \uC560\uB2C8\uBA54\uC774\uC158"
      }
    ]
  },
  {
    id: "lucky-draw",
    name: "\uB79C\uB364 \uBF51\uAE30 / \uB3CC\uB9BC\uD310",
    category: "utility",
    description: "\uC120\uD0DD\uD558\uAE30 \uC5B4\uB824\uC6B4 \uC21C\uAC04\uC5D0 \uC6B4\uC5D0 \uB9E1\uACA8\uC694",
    iconName: "Dices",
    suggestedQuestions: [
      {
        key: "drawVisual",
        question: "\uC5B4\uB5A4 \uBAA8\uC591\uC73C\uB85C \uBF51\uC744\uAE4C\uC694?",
        type: "select",
        options: ["\uBE59\uAE00\uBE59\uAE00 \uB3CC\uC544\uAC00\uB294 \uD589\uC6B4\uC758 \uB8F0\uB81B(\uB3CC\uB9BC\uD310)", "\uB450\uADFC\uB450\uADFC \uBCF4\uBB3C \uC0C1\uC790 \uBF51\uAE30", "\uD754\uB4E4\uB9AC\uB294 \uC0AC\uB2E4\uB9AC \uD0C0\uAE30"],
        defaultValue: "\uBE59\uAE00\uBE59\uAE00 \uB3CC\uC544\uAC00\uB294 \uD589\uC6B4\uC758 \uB8F0\uB81B(\uB3CC\uB9BC\uD310)"
      },
      {
        key: "itemInput",
        question: "\uBF51\uAE30 \uD56D\uBAA9\uC740 \uC5B4\uB5BB\uAC8C \uC815\uD558\uB098\uC694?",
        type: "select",
        options: ["\uC0AC\uC6A9\uC790\uAC00 \uC9C1\uC811 \uD56D\uBAA9 \uBAA9\uB85D \uC785\uB825/\uC218\uC815", "\uAE30\uBCF8 \uCD94\uCC9C \uBAA9\uB85D \uC81C\uACF5 (\uC74C\uC2DD, \uC5ED\uD560 \uB4F1)"],
        defaultValue: "\uC0AC\uC6A9\uC790\uAC00 \uC9C1\uC811 \uD56D\uBAA9 \uBAA9\uB85D \uC785\uB825/\uC218\uC815"
      }
    ]
  },
  {
    id: "leaderboard",
    name: "\uBA85\uC608\uC758 \uC804\uB2F9 (\uC21C\uC704\uD45C)",
    category: "social",
    description: "\uB204\uAC00 \uAC00\uC7A5 \uB192\uC740 \uC810\uC218\uB97C \uC5BB\uC5C8\uB294\uC9C0 \uC21C\uC704\uB97C \uACA8\uB904\uC694",
    iconName: "Award",
    suggestedQuestions: [
      {
        key: "rankingCriteria",
        question: "\uC21C\uC704\uB294 \uBB34\uC5C7\uC73C\uB85C \uC815\uD558\uB098\uC694?",
        type: "select",
        options: ["\uCD5C\uACE0 \uC810\uC218 \uC21C\uC704", "\uCD5C\uB2E8 \uD074\uB9AC\uC5B4 \uC2DC\uAC04 \uC21C\uC704", "\uB204\uC801 \uD65C\uB3D9 \uD69F\uC218 \uC21C\uC704"],
        defaultValue: "\uCD5C\uACE0 \uC810\uC218 \uC21C\uC704"
      },
      {
        key: "nicknameInput",
        question: "\uB7AD\uD0B9 \uB4F1\uB85D \uC2DC \uB2C9\uB124\uC784\uC744 \uBC1B\uB098\uC694?",
        type: "select",
        options: ["3\uAE00\uC790 \uB2C9\uB124\uC784 \uC785\uB825\uBC1B\uAE30", "\uADC0\uC5EC\uC6B4 \uB3D9\uBB3C \uB2C9\uB124\uC784 \uC790\uB3D9 \uC0DD\uC131"],
        defaultValue: "3\uAE00\uC790 \uB2C9\uB124\uC784 \uC785\uB825\uBC1B\uAE30"
      }
    ]
  },
  {
    id: "local-storage",
    name: "\uC790\uB3D9 \uC800\uC7A5 (\uAE30\uC5B5\uD558\uAE30)",
    category: "core",
    description: "\uC6F9 \uBE0C\uB77C\uC6B0\uC800\uB97C \uB2EB\uC544\uB3C4 \uB0B4 \uAE30\uB85D\uC774 \uC0AC\uB77C\uC9C0\uC9C0 \uC54A\uC544\uC694",
    iconName: "Save",
    suggestedQuestions: [
      {
        key: "saveContent",
        question: "\uBB34\uC5C7\uC744 \uC8FC\uB85C \uC800\uC7A5\uD560\uAE4C\uC694?",
        type: "select",
        options: ["\uD560 \uC77C \uBAA9\uB85D\uACFC \uCCB4\uD06C \uC0C1\uD0DC", "\uAC8C\uC784 \uCD5C\uACE0 \uAE30\uB85D\uACFC \uBC43\uC9C0 \uBAA9\uB85D", "\uC791\uC131\uD55C \uC77C\uAE30\uB098 \uBA54\uBAA8 \uC804\uCCB4"],
        defaultValue: "\uD560 \uC77C \uBAA9\uB85D\uACFC \uCCB4\uD06C \uC0C1\uD0DC"
      },
      {
        key: "resetOption",
        question: "\uB370\uC774\uD130\uB97C \uCD08\uAE30\uD654\uD558\uB294 \uAE30\uB2A5\uB3C4 \uB123\uC744\uAE4C\uC694?",
        type: "select",
        options: ["\uB124, [\uC804\uCCB4 \uBE44\uC6B0\uAE30] \uBC84\uD2BC\uC744 \uB9CC\uB4E4\uC5B4 \uC918\uC694", "\uC544\uB2C8\uC694, \uC548\uC804\uD558\uAC8C \uACC4\uC18D \uC720\uC9C0\uD574\uC694"],
        defaultValue: "\uB124, [\uC804\uCCB4 \uBE44\uC6B0\uAE30] \uBC84\uD2BC\uC744 \uB9CC\uB4E4\uC5B4 \uC918\uC694"
      }
    ]
  },
  {
    id: "calculator",
    name: "\uACC4\uC0B0\uAE30 & \uC790\uB3D9 \uD658\uC0B0",
    category: "utility",
    description: "\uC22B\uC790\uB97C \uB123\uC73C\uBA74 \uC790\uB3D9\uC73C\uB85C \uACF5\uC2DD\uC5D0 \uB9DE\uCDB0 \uB69D\uB531 \uACC4\uC0B0\uD574\uC694",
    iconName: "Calculator",
    suggestedQuestions: [
      {
        key: "calcTarget",
        question: "\uC5B4\uB5A4 \uACC4\uC0B0\uC744 \uD558\uB098\uC694?",
        type: "select",
        options: ["\uB354\uD558\uAE30/\uBE7C\uAE30/\uACF1\uD558\uAE30 \uAE30\uBCF8 \uACC4\uC0B0", "\uC6A9\uB3C8 \uD569\uACC4 \uBC0F \uB0A8\uC740 \uB3C8 \uACC4\uC0B0", "\uD560\uC778\uC728 \uB610\uB294 \uC815\uB2F5\uB960 \uBC31\uBD84\uC728 \uACC4\uC0B0"],
        defaultValue: "\uC6A9\uB3C8 \uD569\uACC4 \uBC0F \uB0A8\uC740 \uB3C8 \uACC4\uC0B0"
      }
    ]
  },
  {
    id: "drawing",
    name: "\uADF8\uB9BC \uADF8\uB9AC\uAE30 & \uCE94\uBC84\uC2A4",
    category: "game",
    description: "\uB9C8\uC6B0\uC2A4\uB098 \uD130\uCE58\uB85C \uC0C9\uCE60\uD558\uACE0 \uADF8\uB9BC\uC744 \uADF8\uB824\uC694",
    iconName: "Palette",
    suggestedQuestions: [
      {
        key: "canvasTools",
        question: "\uC5B4\uB5A4 \uADF8\uB9AC\uAE30 \uB3C4\uAD6C\uB97C \uC9C0\uC6D0\uD560\uAE4C\uC694?",
        type: "select",
        options: ["\uC54C\uB85D\uB2EC\uB85D \uC0C9\uC0C1 \uD314\uB808\uD2B8 + \uAD75\uAE30 \uC870\uC808 + \uC9C0\uC6B0\uAC1C", "\uC2A4\uD0EC\uD504 \uCC0D\uAE30 + \uAE30\uBCF8 \uD39C", "\uB2E8\uC21C \uC11C\uBA85/\uB099\uC11C \uD39C"],
        defaultValue: "\uC54C\uB85D\uB2EC\uB85D \uC0C9\uC0C1 \uD314\uB808\uD2B8 + \uAD75\uAE30 \uC870\uC808 + \uC9C0\uC6B0\uAC1C"
      },
      {
        key: "canvasExport",
        question: "\uADF8\uB9B0 \uADF8\uB9BC\uC744 \uC774\uBBF8\uC9C0\uB85C \uC800\uC7A5\uD560 \uC218 \uC788\uB098\uC694?",
        type: "select",
        options: ["\uB124, PNG \uC774\uBBF8\uC9C0 \uB2E4\uC6B4\uB85C\uB4DC \uC9C0\uC6D0", "\uD654\uBA74 \uC548\uC5D0\uC11C\uB9CC \uAC10\uC0C1"],
        defaultValue: "\uB124, PNG \uC774\uBBF8\uC9C0 \uB2E4\uC6B4\uB85C\uB4DC \uC9C0\uC6D0"
      }
    ]
  },
  {
    id: "badges",
    name: "\uCE6D\uCC2C \uB3C4\uC7A5 & \uC5C5\uC801 \uBC43\uC9C0",
    category: "game",
    description: "\uBAA9\uD45C\uB97C \uB2EC\uC131\uD560 \uB54C\uB9C8\uB2E4 \uBA4B\uC9C4 \uBC43\uC9C0\uB97C \uBAA8\uC544\uC694",
    iconName: "Medal",
    suggestedQuestions: [
      {
        key: "badgeTypes",
        question: "\uC5B4\uB5A4 \uC5C5\uC801 \uBC43\uC9C0\uB97C \uC81C\uACF5\uD560\uAE4C\uC694?",
        type: "select",
        options: ["\uCCAB \uC2DC\uC791, 3\uC77C \uC5F0\uC18D, 100\uC810 \uB2EC\uC131 \uB4F1 5\uC885 \uBC43\uC9C0", "\uB808\uBCA8\uBCC4 \uB9C8\uC2A4\uD130 \uCE6D\uD638 \uBD80\uC5EC", "\uBE44\uBC00 \uC870\uAC74 \uB2EC\uC131 \uD788\uB4E0 \uBC43\uC9C0"],
        defaultValue: "\uCCAB \uC2DC\uC791, 3\uC77C \uC5F0\uC18D, 100\uC810 \uB2EC\uC131 \uB4F1 5\uC885 \uBC43\uC9C0"
      }
    ]
  },
  {
    id: "sound-fx",
    name: "\uD6A8\uACFC\uC74C & \uBC30\uACBD\uC74C",
    category: "game",
    description: "\uBC84\uD2BC\uC744 \uB204\uB97C \uB54C\uB9C8\uB2E4 \uD1B5\uD1B5 \uD280\uB294 \uC18C\uB9AC\uAC00 \uB098\uC694",
    iconName: "Volume2",
    suggestedQuestions: [
      {
        key: "soundMute",
        question: "\uC18C\uB9AC\uB97C \uB044\uACE0 \uCF1C\uB294 \uC74C\uC18C\uAC70 \uBC84\uD2BC\uC774 \uD544\uC694\uD55C\uAC00\uC694?",
        type: "select",
        options: ["\uB124, \uC6B0\uCE21 \uC0C1\uB2E8\uC5D0 \uC2A4\uD53C\uCEE4 On/Off \uBC84\uD2BC \uD544\uC218", "\uC544\uB2C8\uC694, \uD6A8\uACFC\uC74C\uB9CC \uAC00\uBCCD\uAC8C Web Audio\uB85C \uC7AC\uC0DD"],
        defaultValue: "\uB124, \uC6B0\uCE21 \uC0C1\uB2E8\uC5D0 \uC2A4\uD53C\uCEE4 On/Off \uBC84\uD2BC \uD544\uC218"
      }
    ]
  },
  {
    id: "pet-grow",
    name: "\uCE90\uB9AD\uD130 / \uD3AB \uC721\uC131",
    category: "game",
    description: "\uC571\uC744 \uB9CE\uC774 \uC4F8\uC218\uB85D \uD3AB\uC774 \uC9C4\uD654\uD558\uACE0 \uB300\uC0AC\uB97C \uD574\uC694",
    iconName: "Sparkles",
    suggestedQuestions: [
      {
        key: "petEvolution",
        question: "\uD3AB\uC740 \uC5B4\uB5BB\uAC8C \uC131\uC7A5\uD558\uB098\uC694?",
        type: "select",
        options: ["\uACBD\uD5D8\uCE58 \uAC8C\uC774\uC9C0\uAC00 \uCC28\uBA74 \uC54C -> \uC544\uAE30 -> \uC5B4\uB978\uC73C\uB85C \uC9C4\uD654", "\uCE5C\uBC00\uB3C4 \uD558\uD2B8\uAC00 \uCC28\uBA74\uC11C \uC0C8\uB85C\uC6B4 \uBAA8\uC790\uB97C \uC500", "\uB2E4\uC591\uD55C \uAC10\uC815 \uD45C\uD604 \uB300\uC0AC \uC7A0\uAE08 \uD574\uC81C"],
        defaultValue: "\uACBD\uD5D8\uCE58 \uAC8C\uC774\uC9C0\uAC00 \uCC28\uBA74 \uC54C -> \uC544\uAE30 -> \uC5B4\uB978\uC73C\uB85C \uC9C4\uD654"
      }
    ]
  },
  {
    id: "search-filter",
    name: "\uAC80\uC0C9 & \uD0DC\uADF8 \uD544\uD130",
    category: "core",
    description: "\uC6D0\uD558\uB294 \uD56D\uBAA9\uC744 \uAE00\uC790\uB098 \uCE74\uD14C\uACE0\uB9AC\uB85C \uBE60\uB974\uAC8C \uCC3E\uC544\uC694",
    iconName: "Search",
    suggestedQuestions: [
      {
        key: "filterCategories",
        question: "\uC5B4\uB5A4 \uD544\uD130 \uD0DC\uADF8\uB97C \uB458\uAE4C\uC694?",
        type: "select",
        options: ["\uC804\uCCB4 / \uC911\uC694 / \uC644\uB8CC / \uBBF8\uC644\uB8CC", "\uACFC\uBAA9\uBCC4 (\uAD6D\uC5B4, \uC218\uD559, \uC601\uC5B4, \uACFC\uD559)", "\uB0A0\uC9DC\uBCC4 (\uC624\uB298, \uC774\uBC88 \uC8FC, \uC9C0\uB09C \uAE30\uB85D)"],
        defaultValue: "\uC804\uCCB4 / \uC911\uC694 / \uC644\uB8CC / \uBBF8\uC644\uB8CC"
      }
    ]
  },
  {
    id: "share-quote",
    name: "\uACB0\uACFC \uCE74\uB4DC \uACF5\uC720 & \uD14D\uC2A4\uD2B8 \uBCF5\uC0AC",
    category: "social",
    description: "\uB0B4 \uBA4B\uC9C4 \uACB0\uACFC\uB97C \uD074\uB9BD\uBCF4\uB4DC\uB85C \uBCF5\uC0AC\uD574\uC11C \uCE5C\uAD6C\uC5D0\uAC8C \uBCF4\uC5EC\uC918\uC694",
    iconName: "Share2",
    suggestedQuestions: [
      {
        key: "shareFormat",
        question: "\uACF5\uC720\uD560 \uB54C \uC5B4\uB5A4 \uD14D\uC2A4\uD2B8\uAC00 \uB9CC\uB4E4\uC5B4\uC9C0\uB098\uC694?",
        type: "select",
        options: ["\uC810\uC218 + \uB9C8\uC2A4\uCF54\uD2B8 \uCE6D\uCC2C \uD55C\uB9C8\uB514 \uD14D\uC2A4\uD2B8 \uBCF5\uC0AC", "\uC608\uC05C \uC694\uC57D \uCE74\uB4DC \uCEA1\uCC98 \uB2E4\uC6B4\uB85C\uB4DC", "\uCD95\uD558 \uBA54\uC2DC\uC9C0 \uD31D\uC5C5 \uB9C1\uD06C"],
        defaultValue: "\uC810\uC218 + \uB9C8\uC2A4\uCF54\uD2B8 \uCE6D\uCC2C \uD55C\uB9C8\uB514 \uD14D\uC2A4\uD2B8 \uBCF5\uC0AC"
      }
    ]
  },
  {
    id: "daily-mission",
    name: "\uC624\uB298\uC758 \uAE5C\uC9DD \uBBF8\uC158",
    category: "game",
    description: "\uB9E4\uC77C \uC0C8\uB85C\uC6B4 \uBBF8\uC158\uC774 \uB098\uD0C0\uB098\uC11C \uB3C4\uC804 \uC695\uAD6C\uB97C \uB192\uC5EC\uC694",
    iconName: "Target",
    suggestedQuestions: [
      {
        key: "missionRefresh",
        question: "\uBBF8\uC158\uC740 \uC5B8\uC81C \uC0C8\uB85C\uACE0\uCE68 \uB418\uB098\uC694?",
        type: "select",
        options: ["\uB9E4\uC77C \uC790\uC815 \uC790\uB3D9\uC73C\uB85C 3\uAC00\uC9C0 \uBBF8\uC158 \uAC31\uC2E0", "\uC6D0\uD560 \uB54C [\uBBF8\uC158 \uB2E4\uC2DC \uBF51\uAE30] \uBC84\uD2BC \uC9C0\uC6D0", "\uACE0\uC815 \uD018\uC2A4\uD2B8 \uB2EC\uC131\uC81C"],
        defaultValue: "\uB9E4\uC77C \uC790\uC815 \uC790\uB3D9\uC73C\uB85C 3\uAC00\uC9C0 \uBBF8\uC158 \uAC31\uC2E0"
      }
    ]
  },
  {
    id: "theme-mode",
    name: "\uD14C\uB9C8 \uC0C9\uC0C1 \uBCC0\uACBD & \uB2E4\uD06C\uBAA8\uB4DC",
    category: "utility",
    description: "\uB0B4\uAC00 \uC88B\uC544\uD558\uB294 \uD30C\uC2A4\uD154 \uC0C9\uC0C1\uC73C\uB85C \uD14C\uB9C8\uB97C \uBC14\uAFD4\uC694",
    iconName: "SunMoon",
    suggestedQuestions: [
      {
        key: "themeChoices",
        question: "\uC5B4\uB5A4 \uD14C\uB9C8\uB4E4\uC744 \uACE0\uB97C \uC218 \uC788\uAC8C \uD560\uAE4C\uC694?",
        type: "select",
        options: ["\uD30C\uC2A4\uD154 \uC610\uB85C\uC6B0 / \uBBFC\uD2B8 / \uC2A4\uCE74\uC774 / \uB77C\uBCA4\uB354 / \uB2E4\uD06C", "\uB0AE \uBAA8\uB4DC\uC640 \uBC24 \uBAA8\uB4DC 2\uC885\uB958", "\uADC0\uC5EC\uC6B4 \uC77C\uB7EC\uC2A4\uD2B8 \uBC30\uACBD 3\uC885"],
        defaultValue: "\uD30C\uC2A4\uD154 \uC610\uB85C\uC6B0 / \uBBFC\uD2B8 / \uC2A4\uCE74\uC774 / \uB77C\uBCA4\uB354 / \uB2E4\uD06C"
      }
    ]
  }
];
var MASCOTS = [
  {
    id: "squirrel",
    name: "\uB610\uB9AC",
    animal: "\uB2E4\uB78C\uC950",
    emoji: "\u{1F43F}\uFE0F",
    cheerPhrase: "\uC624\uB298\uB3C4 \uB3C4\uD1A0\uB9AC\uCC98\uB7FC \uAF49 \uCC2C \uD558\uB8E8\uB97C \uB9CC\uB4E4\uC5B4\uBCF4\uC790!",
    avatarBg: "bg-amber-100 border-amber-300 text-amber-800"
  },
  {
    id: "cat",
    name: "\uB0E5\uC774",
    animal: "\uACE0\uC591\uC774",
    emoji: "\u{1F431}",
    cheerPhrase: "\uB108\uC758 \uBA4B\uC9C4 \uC544\uC774\uB514\uC5B4, \uB0B4\uAC00 \uC824\uB9AC \uBC1C\uBC14\uB2E5\uC73C\uB85C \uC751\uC6D0\uD560\uAC8C!",
    avatarBg: "bg-pink-100 border-pink-300 text-pink-800"
  },
  {
    id: "robot",
    name: "\uD551\uD401",
    animal: "\uC2A4\uB9C8\uD2B8 \uB85C\uBD07",
    emoji: "\u{1F916}",
    cheerPhrase: "\uC090\uBE45! \uAE30\uD68D \uC644\uBCBD\uB3C4 100%! \uBA4B\uC9C4 \uC571\uC774 \uC644\uC131\uB420 \uAC70\uC57C!",
    avatarBg: "bg-sky-100 border-sky-300 text-sky-800"
  },
  {
    id: "dog",
    name: "\uBF40\uC090",
    animal: "\uAC15\uC544\uC9C0",
    emoji: "\u{1F436}",
    cheerPhrase: "\uAF2C\uB9AC\uB97C \uC0B4\uB791\uC0B4\uB791 \uD754\uB4E4\uBA70 \uD798\uCC28\uAC8C \uD30C\uC774\uD305!",
    avatarBg: "bg-emerald-100 border-emerald-300 text-emerald-800"
  },
  {
    id: "chick",
    name: "\uC090\uC57D\uC774",
    animal: "\uBCD1\uC544\uB9AC",
    emoji: "\u{1F425}",
    cheerPhrase: "\uC090\uC57D! \uC791\uC740 \uD55C \uAC78\uC74C\uC774 \uC704\uB300\uD55C \uC571\uC744 \uB9CC\uB4E4\uC5B4!",
    avatarBg: "bg-yellow-100 border-yellow-300 text-yellow-800"
  },
  {
    id: "hamster",
    name: "\uBAA8\uCC0C",
    animal: "\uD584\uC2A4\uD130",
    emoji: "\u{1F439}",
    cheerPhrase: "\uBCFC\uC774 \uBE75\uBE75\uD574\uC9C8 \uB9CC\uD07C \uAE30\uBD84 \uC88B\uC740 \uC131\uACF5\uC744 \uC120\uBB3C\uD560\uAC8C!",
    avatarBg: "bg-orange-100 border-orange-300 text-orange-800"
  }
];

// src/utils/promptGenerator.ts
function buildExpertCodingPrompt(blueprint) {
  const appName = blueprint.appName.trim() || "\uC2A4\uB9C8\uD2B8 \uD559\uC0DD \uC6F9\uC571";
  const appSlogan = blueprint.appSlogan.trim() || "\uD559\uC0DD\uC744 \uC704\uD55C \uC990\uAC81\uACE0 \uB611\uB611\uD55C \uC6F9 \uC5B4\uD50C\uB9AC\uCF00\uC774\uC158";
  const mascot = blueprint.mascot || MASCOTS[0];
  const idea = blueprint.ideaText.trim() || blueprint.selectedIdeaChip || "\uD559\uC0DD\uC744 \uC704\uD55C \uC720\uC6A9\uD55C \uC6F9 \uC11C\uBE44\uC2A4";
  const purposes = blueprint.purposes.length > 0 ? blueprint.purposes.join(", ") : "\uACF5\uBD80 \uBC0F \uD559\uC2B5, \uC77C\uC0C1 \uD3B8\uC758";
  const targetUsers = blueprint.targetUsers.length > 0 ? blueprint.targetUsers.join(", ") : "\uD559\uC0DD, \uCE5C\uAD6C, \uC120\uC0DD\uB2D8";
  const specialIdea = blueprint.specialIdea.trim() || blueprint.selectedSpecialIdeaChip || "\uBBF8\uC158 \uB2EC\uC131 \uC2DC \uB9C8\uC2A4\uCF54\uD2B8 \uCD95\uD558 \uC5F0\uCD9C";
  const featureSections = blueprint.features.map((featId, idx) => {
    const config = FEATURE_CONFIGS.find((f) => f.id === featId);
    const featName = config ? config.name : featId;
    const details = blueprint.featureDetails[featId] || {};
    const detailList = Object.entries(details).map(([k, v]) => `    - **${k}**: ${v}`).join("\n");
    return `### ${idx + 1}. ${featName}
  - **\uAE30\uB2A5 \uAC1C\uC694**: ${config ? config.description : "\uD575\uC2EC \uAE30\uB2A5"}
  - **\uC138\uBD80 \uC124\uC815 \uBC0F \uB3D9\uC791 \uADDC\uCE59**:
${detailList || "    - \uD45C\uC900 \uCE5C\uD654\uC801 \uC778\uD130\uB799\uC158 \uBC0F \uC989\uC2DC \uBC18\uC751\uD615 \uC778\uD130\uD398\uC774\uC2A4 \uC801\uC6A9"}`;
  }).join("\n\n");
  const screens = blueprint.screens && blueprint.screens.length > 0 ? blueprint.screens.join(", ") : "\uBA54\uC778 \uD648 \uD654\uBA74, \uAE30\uB2A5 \uC2E4\uD589 \uD654\uBA74, \uACB0\uACFC & \uCD95\uD558 \uBCF4\uC0C1 \uD654\uBA74, \uAE30\uB85D/\uC800\uC7A5 \uBCF4\uAD00\uD568";
  const aiSuggestions = blueprint.aiScreenSuggestions && blueprint.aiScreenSuggestions.length > 0 ? `
  - **\uCD94\uCC9C \uD654\uBA74 \uD750\uB984**: ${blueprint.aiScreenSuggestions.join(" \u2794 ")}` : "";
  const targetDirective = "Google AI Studio(Build) \uD658\uACBD\uC5D0\uC11C \uC2E4\uD589 \uAC00\uB2A5\uD55C \uCD5C\uC2E0 React, TypeScript, Tailwind CSS, Lucide React \uC544\uC774\uCF58 \uAE30\uBC18\uC758 \uBAA8\uB4C8\uD654\uB41C \uC644\uC131\uD615 \uC6F9 \uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uCF54\uB4DC\uB85C \uC791\uC131\uD574 \uC918.";
  return `# [AI \uCF54\uB529 \uC9C0\uC2DC\uC11C] ${appName} (${appSlogan})

> **\uAC1C\uBC1C \uD658\uACBD**: Google AI Studio (Build) \uC6F9 \uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uAC1C\uBC1C \uC804\uC6A9
> **\uBAA9\uD45C**: \uD559\uC0DD \uB208\uB192\uC774\uC5D0 \uB9DE\uCD98 \uC27D\uACE0 \uC9C1\uAD00\uC801\uC774\uBA70 \uC7AC\uBBF8\uC788\uB294 \uACE0\uD488\uC9C8 \uC6F9 \uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uAC1C\uBC1C
> **\uB3C4\uAD6C \uAC00\uC774\uB4DC**: ${targetDirective}

---

## 1. \uD504\uB85C\uC81D\uD2B8 \uAC1C\uC694 & \uAE30\uD68D \uBC30\uACBD
- **\uC571 \uC774\uB984**: ${appName}
- **\uC2AC\uB85C\uAC74**: ${appSlogan}
- **\uAE30\uD68D \uC544\uC774\uB514\uC5B4 \uC6D0\uBB38**:
  "${idea}"
- **\uC571\uC758 \uBAA9\uC801**: ${purposes} ${blueprint.customPurpose ? `(\uCD94\uAC00: ${blueprint.customPurpose})` : ""}
- **\uC8FC\uC694 \uB300\uC0C1 \uC0AC\uC6A9\uC790**: ${targetUsers} ${blueprint.customTargetUser ? `(\uCD94\uAC00: ${blueprint.customTargetUser})` : ""}

---

## 2. \uB514\uC790\uC778 \uC2DC\uC2A4\uD15C & \uB9C8\uC2A4\uCF54\uD2B8 \uC778\uD130\uB799\uC158
- **\uBE44\uC8FC\uC5BC \uC2A4\uD0C0\uC77C**: ${blueprint.designStyle || "\uB465\uAE00\uB465\uAE00 \uADC0\uC5EC\uC6B4 \uD30C\uC2A4\uD154 \uC2A4\uD0C0\uC77C (\uBAA8\uC11C\uB9AC rounded-2xl, \uCE5C\uADFC\uD55C \uCE74\uB4DC\uD615 \uB808\uC774\uC544\uC6C3)"}
- **\uB300\uD45C \uD14C\uB9C8 \uCEEC\uB7EC**: ${blueprint.themeColor || "\uB530\uB73B\uD55C \uD587\uC0B4 \uC610\uB85C\uC6B0 (#F59E0B) & \uD30C\uC2A4\uD154 \uBC30\uACBD (#FEF3C7)"}
- **\uC751\uC6D0 \uB9C8\uC2A4\uCF54\uD2B8**:
  - **\uC774\uB984 & \uB3D9\uBB3C**: ${mascot.emoji} ${mascot.name} (${mascot.animal})
  - **\uB300\uD45C \uC751\uC6D0 \uB300\uC0AC**: "${mascot.cheerPhrase}"
  - **\uD654\uBA74 \uB0B4 \uC5ED\uD560**: \uC0C1\uB2E8 \uD5E4\uB354 \uBC0F \uC911\uC694 \uC774\uBCA4\uD2B8(\uC131\uACF5, \uC644\uB8CC, \uB808\uBCA8\uC5C5) \uC2DC \uB9D0\uD48D\uC120\uC73C\uB85C \uC751\uC6D0 \uBA54\uC2DC\uC9C0 \uD45C\uC2DC, \uD074\uB9AD \uC2DC \uD1B5\uD1B5 \uD280\uB294 \uBC14\uC6B4\uC2A4 \uC560\uB2C8\uBA54\uC774\uC158
${blueprint.customDesignNotes ? `- **\uC0AC\uC6A9\uC790 \uB514\uC790\uC778 \uC694\uCCAD**: ${blueprint.customDesignNotes}
` : ""}
---

## 3. \uD654\uBA74 \uAD6C\uC131 \uBC0F \uC0AC\uC6A9\uC790 \uD50C\uB85C\uC6B0 (Screens & UX Flow)
- **\uC8FC\uC694 \uD654\uBA74 \uBAA9\uB85D**: ${screens}${aiSuggestions}
${blueprint.screenFlowNotes ? `- **\uD654\uBA74 \uC804\uD658 \uD2B9\uC774\uC0AC\uD56D**: ${blueprint.screenFlowNotes}` : ""}
- **\uD654\uBA74 \uB808\uC774\uC544\uC6C3 \uC6D0\uCE59**:
  1. \uBAA8\uBC14\uC77C\uACFC \uD0DC\uBE14\uB9BF, PC \uD654\uBA74 \uBAA8\uB450\uC5D0\uC11C \uAE68\uC9C0\uC9C0 \uC54A\uB294 \uC644\uC804\uD55C \uBC18\uC751\uD615(Responsive) \uB808\uC774\uC544\uC6C3
  2. \uD55C \uD654\uBA74\uC5D0 \uB108\uBB34 \uB9CE\uC740 \uAE00\uC790\uB97C \uB123\uC9C0 \uC54A\uACE0, \uD07C\uC9C1\uD55C \uC544\uC774\uCF58\uACFC \uBC84\uD2BC(\uCD5C\uC18C \uD130\uCE58 \uC601\uC5ED 48px \uC774\uC0C1)
  3. \uD604\uC7AC \uC9C4\uD589 \uC0C1\uD0DC\uB97C \uC54C \uC218 \uC788\uB294 \uC2DC\uAC01\uC801 \uAC8C\uC774\uC9C0 \uBC0F \uBA85\uD655\uD55C [\uC774\uC804] / [\uB2E4\uC74C] \uBC84\uD2BC \uC9C0\uC6D0

---

## 4. \uD575\uC2EC \uAE30\uB2A5 \uBC0F \uC0C1\uC138 \uB3D9\uC791 \uADDC\uCE59 (Detailed Features)
${featureSections || "\uAE30\uBCF8 \uC778\uD130\uB799\uD2F0\uBE0C \uAE30\uB2A5 \uBC0F \uB85C\uCEEC \uC800\uC7A5\uC18C \uC5F0\uB3D9"}

---

## 5. \uD559\uC0DD \uAE30\uD68D\uC790\uC758 \uD0AC\uB7EC \uC544\uC774\uB514\uC5B4 (Delight & Surprise Factor)
\u{1F31F} **\uD575\uC2EC \uC7AC\uBBF8 \uC694\uC18C**:
"${specialIdea}"
- \uC774 \uD2B9\uBCC4\uD55C \uC544\uC774\uB514\uC5B4\uAC00 \uC2DC\uAC01\uC801/\uCCAD\uAC01\uC801\uC73C\uB85C \uC0DD\uC0DD\uD558\uAC8C \uCCB4\uAC10\uB420 \uC218 \uC788\uB3C4\uB85D, \uD654\uBA74 \uB0B4 \uD30C\uD2F0\uD074 \uD3ED\uC8FD(Canvas confetti \uB610\uB294 CSS animation), \uB9C8\uC2A4\uCF54\uD2B8 \uCD95\uD558 \uD31D\uC5C5, \uCD95\uD558 \uBC43\uC9C0 \uD68D\uB4DD \uD6A8\uACFC\uB97C \uBC18\uB4DC\uC2DC \uAD6C\uD604\uD574 \uC918.

---

## 6. \uAE30\uC220 \uC0AC\uC591 \uBC0F \uB370\uC774\uD130 \uC601\uC18D\uC131 \uC694\uAD6C\uC0AC\uD56D
1. **\uAE30\uC220 \uC2A4\uD0DD**: React, TypeScript, Tailwind CSS, Lucide React \uC544\uC774\uCF58
2. **\uB370\uC774\uD130 \uC800\uC7A5**: \`localStorage\`\uB97C \uD65C\uC6A9\uD558\uC5EC \uC6F9 \uBE0C\uB77C\uC6B0\uC800\uB97C \uC0C8\uB85C\uACE0\uCE68\uD558\uAC70\uB098 \uAED0\uB2E4 \uCF1C\uB3C4 \uC0AC\uC6A9\uC790\uC758 \uC9C4\uD589 \uC0C1\uD0DC, \uC810\uC218, \uD560 \uC77C, \uD68D\uB4DD\uD55C \uBC43\uC9C0 \uB370\uC774\uD130\uAC00 \uC548\uC804\uD558\uAC8C \uC720\uC9C0\uB418\uB3C4\uB85D \uAD6C\uD604
3. **\uD6A8\uACFC\uC74C & \uC560\uB2C8\uBA54\uC774\uC158**: \uBE0C\uB77C\uC6B0\uC800 Web Audio API \uAE30\uBC18\uC758 \uAC00\uBCBC\uC6B4 \uD6A8\uACFC\uC74C(\uC131\uACF5 \uD321\uD30C\uB808, \uD074\uB9AD\uC74C)\uACFC \uBB34\uC18C\uC74C \uD658\uACBD\uC744 \uC704\uD55C \uC74C\uC18C\uAC70(Mute) \uD1A0\uAE00 \uBC84\uD2BC \uC81C\uACF5
4. **\uC811\uADFC\uC131 \uBC0F \uC548\uC815\uC131**: \uD559\uC0DD\uC774 \uC870\uC791\uD558\uAE30 \uC27D\uB3C4\uB85D \uC26C\uC6B4 \uD55C\uAD6D\uC5B4 \uC548\uB0B4 \uBA54\uC2DC\uC9C0 \uC81C\uACF5, \uC798\uBABB\uB41C \uC785\uB825 \uC2DC \uCE5C\uC808\uD55C \uC548\uB0B4 \uD31D\uC5C5 \uCD9C\uB825

---

## 7. \uAC1C\uBC1C \uC2E4\uD589 \uC694\uCCAD
\uC704 \uAE30\uD68D\uC11C\uC758 \uBAA8\uB4E0 \uC694\uC18C(\uB9C8\uC2A4\uCF54\uD2B8, \uAE30\uB2A5 \uC138\uBD80 \uADDC\uCE59, \uD0AC\uB7EC \uC544\uC774\uB514\uC5B4, \uB85C\uCEEC \uC800\uC7A5\uC18C, \uBC18\uC751\uD615 \uCE74\uB4DC UI)\uB97C \uBE60\uC9D0\uC5C6\uC774 \uD3EC\uD568\uD558\uC5EC, **\uB204\uB77D\uB41C \uBAA8\uB4C8\uC774\uB098 TODO \uC8FC\uC11D \uC5C6\uC774 \uBC14\uB85C \uC2E4\uD589 \uAC00\uB2A5\uD55C \uC644\uC131\uD615 \uCF54\uB4DC**\uB97C \uC791\uC131\uD574 \uC8FC\uC138\uC694.`;
}
function buildRevisionPrompt(blueprint, revision) {
  const appName = blueprint.appName || "\uD559\uC0DD \uC6F9\uC571";
  const categoryMap = {
    ui: "\u{1F3A8} UI/\uB514\uC790\uC778 \uC218\uC815",
    bug: "\u{1F41B} \uB3D9\uC791 \uC624\uB958 \uBC0F \uBC84\uADF8 \uD574\uACB0",
    feature: "\u2728 \uAE30\uB2A5 \uCD94\uAC00 \uBC0F \uADDC\uCE59 \uBCC0\uACBD",
    speed: "\u26A1 \uC0AC\uC6A9\uC131 \uBC0F \uBC18\uC751 \uC18D\uB3C4 \uAC1C\uC120"
  };
  return `# [AI \uCF54\uB529 \uC218\uC815 \uC694\uCCAD\uC11C] ${appName} \uD53C\uB4DC\uBC31 \uBC0F \uCF54\uB4DC \uAC1C\uC120

\uC548\uB155\uD558\uC138\uC694! \uBC29\uAE08 \uC81C\uC791\uD574 \uC900 **${appName}** \uC6F9\uC571\uC744 \uC9C1\uC811 \uD14C\uC2A4\uD2B8\uD574 \uBCF4\uC558\uC2B5\uB2C8\uB2E4.
\uD559\uC0DD \uC0AC\uC6A9\uC790\uAC00 \uB354 \uD3B8\uD558\uACE0 \uC7AC\uBBF8\uC788\uAC8C \uC0AC\uC6A9\uD560 \uC218 \uC788\uB3C4\uB85D \uC544\uB798\uC758 \uC218\uC815 \uC0AC\uD56D\uC744 \uC989\uC2DC \uBC18\uC601\uD574 \uC8FC\uC138\uC694.

---

## \u{1F4CC} \uC218\uC815 \uBD84\uC57C
**${categoryMap[revision.category] || "\uAE30\uB2A5 \uAC1C\uC120"}**

## \u{1F6A8} \uBC1C\uACAC\uD55C \uBB38\uC81C \uB610\uB294 \uBCC0\uACBD \uD76C\uB9DD \uC0AC\uD56D
"${revision.problemDescription}"

## \u{1F6E0}\uFE0F \uAD6C\uCCB4\uC801\uC778 \uC218\uC815 \uC9C0\uC2DC \uC0AC\uD56D
${revision.specificRequest ? `"${revision.specificRequest}"` : "- \uC704 \uBB38\uC81C\uB97C \uC644\uBCBD\uD788 \uD574\uACB0\uD558\uACE0 \uAD00\uB828 UI\uC640 \uC560\uB2C8\uBA54\uC774\uC158\uC774 \uBD80\uB4DC\uB7FD\uAC8C \uC5F0\uB3D9\uB418\uB3C4\uB85D \uCF54\uB4DC\uB97C \uB2E4\uB4EC\uC5B4 \uC918."}

---

## \u{1F4A1} \uAE30\uC874 \uC571\uC758 \uD575\uC2EC \uB9E5\uB77D (\uC720\uC9C0\uB418\uC5B4\uC57C \uD560 \uBD80\uBD84)
- **\uB9C8\uC2A4\uCF54\uD2B8**: ${blueprint.mascot ? `${blueprint.mascot.emoji} ${blueprint.mascot.name} (${blueprint.mascot.animal})\uC758 \uC751\uC6D0 \uB300\uC0AC \uC720\uC9C0` : "\uAE30\uBCF8 \uCE90\uB9AD\uD130 \uC751\uC6D0 \uC778\uD130\uB799\uC158 \uC720\uC9C0"}
- **\uD14C\uB9C8 \uC0C9\uC0C1**: ${blueprint.themeColor || "\uD30C\uC2A4\uD154 \uD14C\uB9C8"}
- **\uB370\uC774\uD130 \uBCF4\uC874**: \uAE30\uC874 localStorage \uC800\uC7A5 \uAD6C\uC870\uAC00 \uAE68\uC9C0\uC9C0 \uC54A\uB3C4\uB85D \uD638\uD658\uC131 \uC720\uC9C0
- **\uC0AC\uC6A9\uC790 \uB208\uB192\uC774**: \uD559\uC0DD\uC774 \uC774\uD574\uD558\uAE30 \uC26C\uC6B4 \uD07C\uC9C1\uD55C \uBC84\uD2BC\uACFC \uC9C1\uAD00\uC801\uC778 \uC548\uB0B4 \uBB38\uAD6C \uC720\uC9C0

\uC704 \uC218\uC815 \uC0AC\uD56D\uC744 \uC628\uC804\uD788 \uBC18\uC601\uD55C **\uC804\uCCB4 \uC218\uC815 \uCF54\uB4DC \uB610\uB294 \uBCC0\uACBD\uB41C \uCEF4\uD3EC\uB10C\uD2B8 \uCF54\uB4DC**\uB97C \uBC14\uB85C \uBD99\uC5EC\uB123\uC744 \uC218 \uC788\uB3C4\uB85D \uC791\uC131\uD574 \uC8FC\uC138\uC694!`;
}

// src/apiServer.ts
dotenv.config();
var app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var cachedModels = null;
var CACHE_TTL_MS = 30 * 60 * 1e3;
async function discoverSupportedGeminiModels(ai) {
  const now = Date.now();
  if (cachedModels && now - cachedModels.timestamp < CACHE_TTL_MS && cachedModels.list.length > 0) {
    return cachedModels.list;
  }
  const default36PlusModels = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest"
  ];
  try {
    const list = await ai.models.list();
    const candidates = [];
    for await (const m of list) {
      const rawName = (m.name || "").replace(/^models\//, "");
      const actions = m.supportedActions || [];
      if (!actions.includes("generateContent")) continue;
      if (!rawName.startsWith("gemini")) continue;
      if (/(tts|image|audio|embed|robotics|computer-use|transcribe)/i.test(rawName)) continue;
      const match = rawName.match(/gemini-(\d+(?:\.\d+)?)/);
      if (match) {
        const ver = parseFloat(match[1]);
        if (ver >= 3.6) {
          candidates.push({ name: rawName, ver, isFlash: rawName.includes("flash") });
        }
      } else if (rawName.includes("latest")) {
        candidates.push({ name: rawName, ver: 99, isFlash: rawName.includes("flash") });
      }
    }
    if (candidates.length > 0) {
      candidates.sort((a, b) => {
        if (a.isFlash !== b.isFlash) return a.isFlash ? -1 : 1;
        return b.ver - a.ver;
      });
      const uniqueNames = Array.from(new Set(candidates.map((c) => c.name)));
      console.log(`[Gemini Dynamic Discovery] Found ${uniqueNames.length} models (>= 3.6):`, uniqueNames);
      cachedModels = { list: uniqueNames, timestamp: now };
      return uniqueNames;
    }
  } catch (err) {
    console.warn("[Gemini Dynamic Discovery] models.list notice:", err?.message || err);
  }
  const primaryModel = process.env.GEMINI_MODEL;
  const fallback = primaryModel ? [primaryModel, ...default36PlusModels.filter((m) => m !== primaryModel)] : default36PlusModels;
  cachedModels = { list: fallback, timestamp: now };
  return fallback;
}
async function callGeminiWithRetry(ai, promptConfig, maxRetries = 1) {
  const models = await discoverSupportedGeminiModels(ai);
  let lastError;
  for (const model of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptConfig.contents,
          config: {
            ...promptConfig.systemInstruction ? { systemInstruction: promptConfig.systemInstruction } : {},
            ...promptConfig.responseMimeType ? { responseMimeType: promptConfig.responseMimeType } : {},
            ...typeof promptConfig.temperature === "number" ? { temperature: promptConfig.temperature } : {}
          }
        });
        return response.text || "";
      } catch (err) {
        lastError = err;
        const status = err?.status || err?.code || err?.error && err.error.code;
        const message = String(err?.message || "");
        const isQuota = status === 429 || message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("quota");
        if (isQuota) {
          console.warn(`[Gemini API] Quota exhausted on ${model}, immediately trying next model...`);
          break;
        }
        const isTransient = status === 503 || message.includes("503") || message.includes("high demand") || message.includes("UNAVAILABLE");
        if (isTransient) {
          if (attempt < maxRetries) {
            const delay = (attempt + 1) * 800;
            console.warn(`[Gemini API] Temporary spike on ${model} (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          console.warn(`[Gemini API] Model ${model} is experiencing temporary high demand, trying next model...`);
          break;
        } else {
          break;
        }
      }
    }
  }
  throw lastError;
}
var memorySubmissions = [];
var apiRouter = express.Router();
var getApiStatus = async () => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const hasKey = Boolean(key && key.length > 5);
  const ai = getGeminiClient();
  const models = ai ? await discoverSupportedGeminiModels(ai) : ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
  return {
    status: "ok",
    name: "IdeaSpark API Server",
    geminiKeyConfigured: hasKey,
    activeModel: models[0] || "gemini-3.8-flash",
    supportedModels: models,
    autoDiscovery: "3.6+ \uBAA8\uB378 \uC790\uB3D9 \uD0D0\uC0C9 \uAE30\uB2A5 \uD65C\uC131\uD654\uB428",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
};
apiRouter.get("/", async (req, res) => {
  const status = await getApiStatus();
  res.json(status);
});
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
apiRouter.get("/gemini/status", async (req, res) => {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const hasKey = Boolean(key && key.length > 5);
  const ai = getGeminiClient();
  const models = ai ? await discoverSupportedGeminiModels(ai) : ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
  res.json({
    available: true,
    hasKey,
    activeModel: models[0] || "gemini-3.8-flash",
    supportedModels: models,
    autoDiscovery: "3.6+ \uC790\uB3D9 \uD0D0\uC0C9 \uD65C\uC131\uD654",
    message: hasKey ? `${models[0] || "Gemini 3.8 Flash"} AI \uC5D4\uC9C4\uC774 \uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4 (3.6+ \uBAA8\uB378 \uC790\uB3D9 \uD0D0\uC0C9 \uBC0F \uB300\uCCB4 \uC9C0\uC6D0).` : "Vercel \uD658\uACBD\uBCC0\uC218(GEMINI_API_KEY) \uC124\uC815 \uC2DC 3.6+ \uBC84\uC804 \uC774\uC0C1\uC758 \uCD5C\uC2E0 Gemini \uBAA8\uB378\uC744 \uC790\uB3D9 \uAC10\uC9C0\uD558\uC5EC \uB3D9\uC791\uD569\uB2C8\uB2E4."
  });
});
apiRouter.post("/gemini/generate-prompt", async (req, res) => {
  const { blueprint } = req.body;
  if (!blueprint) {
    return res.status(400).json({ error: "\uBE14\uB8E8\uD504\uB9B0\uD2B8 \uB370\uC774\uD130\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4." });
  }
  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemInstruction = `\uB2F9\uC2E0\uC740 \uD559\uC0DD(\uC5B4\uB9B0\uC774/\uCCAD\uC18C\uB144)\uC744 \uC704\uD55C \uAC10\uC131\uC801\uC774\uACE0 \uC9C1\uAD00\uC801\uC778 \uC6F9\uC571 \uAE30\uD68D \uC804\uBB38\uAC00\uC774\uC790, Google AI Studio (\uAD6C\uAE00 AI \uC2A4\uD29C\uB514\uC624)\uC5D0 \uCD5C\uC801\uD654\uB41C \uD504\uB86C\uD504\uD2B8\uB97C \uC81C\uC791\uD558\uB294 \uC218\uC11D \uD480\uC2A4\uD0DD \uC6F9 \uAC1C\uBC1C\uC790\uC785\uB2C8\uB2E4.
\uBC18\uB4DC\uC2DC \uC9C0\uCF1C\uC57C \uD560 \uADDC\uCE59:
1. \uB300\uC0C1 \uC0AC\uC6A9\uC790\uB97C \uC9C0\uCE6D\uD560 \uB54C\uB294 \uC808\uB300 '\uCD08\uB4F1\uD559\uC0DD'\uC774\uB77C\uB294 \uB2E8\uC5B4\uB97C \uC4F0\uC9C0 \uB9D0\uACE0, \uD56D\uC0C1 '\uD559\uC0DD', '\uCE5C\uAD6C\uB4E4', '\uCCAD\uC18C\uB144' \uB4F1\uC758 \uCE5C\uADFC\uD558\uACE0 \uD3EC\uC6A9\uC801\uC778 \uB2E8\uC5B4\uB9CC \uC0AC\uC6A9\uD558\uC2ED\uC2DC\uC624.
2. \uAE30\uD68D\uB41C \uB0B4\uC6A9(\uBAA9\uC801, \uB300\uC0C1, 16\uAC00\uC9C0 \uC911 \uC120\uD0DD\uB41C \uAE30\uB2A5\uACFC \uC138\uBD80 \uADDC\uCE59, \uD654\uBA74 \uD750\uB984, \uB9C8\uC2A4\uCF54\uD2B8 \uCE90\uB9AD\uD130\uC640 \uC751\uC6D0 \uB300\uC0AC, \uD0AC\uB7EC \uC544\uC774\uB514\uC5B4, \uD14C\uB9C8 \uC0C9\uC0C1)\uC744 \uBAA8\uB450 \uBC18\uC601\uD558\uC5EC, Google AI Studio\uC5D0\uC11C \uD55C \uBC88\uC5D0 \uC644\uC131\uD615 \uCF54\uB4DC\uB97C \uCD9C\uB825\uD560 \uC218 \uC788\uB3C4\uB85D \uC815\uBC00\uD558\uACE0 \uAD6C\uCCB4\uC801\uC778 \uC9C0\uC2DC\uC11C\uB97C \uB9C8\uD06C\uB2E4\uC6B4 \uD615\uC2DD\uC73C\uB85C \uC791\uC131\uD558\uC2ED\uC2DC\uC624.
3. \uAE30\uC220 \uC2A4\uD0DD\uC740 Vite, React, TypeScript, Tailwind CSS, Lucide React \uC544\uC774\uCF58, LocalStorage\uB97C \uAE30\uBCF8\uC73C\uB85C \uBA85\uC2DC\uD558\uC2ED\uC2DC\uC624.`;
      const promptText = `\uC544\uB798 \uD559\uC0DD\uC774 \uC791\uC131\uD55C 10\uB2E8\uACC4 \uC6F9\uC571 \uAE30\uD68D \uBE14\uB8E8\uD504\uB9B0\uD2B8\uB97C \uAE30\uBC18\uC73C\uB85C, Google AI Studio(\uAD6C\uAE00 AI \uC2A4\uD29C\uB514\uC624)\uC5D0 \uBC14\uB85C \uBCF5\uC0AC\uD558\uC5EC \uC644\uC131\uD615 \uC6F9\uC571\uC744 \uB9CC\uB4E4 \uC218 \uC788\uB294 \uC804\uBB38\uAC00 \uC218\uC900\uC758 \uC0C1\uC138 \uD504\uB86C\uD504\uD2B8\uB97C \uC791\uC131\uD574 \uC8FC\uC138\uC694.

[\uAE30\uD68D \uBE14\uB8E8\uD504\uB9B0\uD2B8 \uB370\uC774\uD130]:
${JSON.stringify(blueprint, null, 2)}

[\uC694\uAD6C \uACB0\uACFC \uD615\uC2DD]:
- # [AI \uCF54\uB529 \uC9C0\uC2DC\uC11C] \uC571 \uC774\uB984 \uBC0F \uC2AC\uB85C\uAC74
- 1. \uD504\uB85C\uC81D\uD2B8 \uAC1C\uC694 & \uD559\uC0DD \uB208\uB192\uC774 \uBAA9\uC801
- 2. \uB514\uC790\uC778 \uC2DC\uC2A4\uD15C, \uD30C\uC2A4\uD154 \uCEEC\uB7EC, \uB9C8\uC2A4\uCF54\uD2B8 \uC778\uD130\uB799\uC158(${blueprint.mascot?.name || "\uB610\uB9AC"} \uCE90\uB9AD\uD130\uC758 \uB300\uC0AC \uBC0F \uC5ED\uD560)
- 3. \uC8FC\uC694 \uD654\uBA74 \uAD6C\uC131 \uBC0F \uC0AC\uC6A9\uC790 \uD750\uB984
- 4. \uD575\uC2EC \uAE30\uB2A5\uACFC \uC138\uBD80 \uB3D9\uC791 \uADDC\uCE59(\uC0AC\uC6A9\uC790\uAC00 \uC785\uB825\uD55C \uC138\uBD80 \uC124\uC815 \uC9C8\uBB38 \uB2F5\uBCC0 \uBC18\uC601)
- 5. \uD0AC\uB7EC \uC544\uC774\uB514\uC5B4 \uBC0F \uCD95\uD558/\uBCF4\uC0C1 \uC5F0\uCD9C (\uD30C\uD2F0\uD074, \uD3ED\uC8FD, \uC18C\uB9AC \uB4F1)
- 6. \uAE30\uC220 \uC0AC\uC591 (React, Tailwind, LocalStorage \uB370\uC774\uD130 \uC601\uC18D\uC131)
- 7. AI \uCF54\uB529 \uB3C4\uAD6C\uB97C \uD5A5\uD55C \uC644\uC131\uB3C4 \uC694\uAD6C \uAC00\uC774\uB4DC`;
      const generatedText = await callGeminiWithRetry(ai, {
        systemInstruction,
        contents: promptText,
        temperature: 0.7
      });
      if (generatedText && generatedText.trim().length > 50) {
        return res.json({ prompt: generatedText, source: "gemini" });
      }
    } catch (err) {
      console.warn("[Gemini Prompt Generator] API call notice:", err?.message || err);
    }
  }
  const fallback = buildExpertCodingPrompt(blueprint);
  res.json({
    prompt: fallback,
    source: "fallback",
    notice: "\uC2A4\uB9C8\uD2B8 \uAE30\uD68D \uC5D4\uC9C4\uC73C\uB85C \uCD5C\uC801\uD654\uB41C \uD504\uB86C\uD504\uD2B8\uB97C \uC0DD\uC131\uD588\uC2B5\uB2C8\uB2E4."
  });
});
apiRouter.post("/gemini/recommend-screens", async (req, res) => {
  const { blueprint } = req.body;
  const ai = getGeminiClient();
  if (ai) {
    try {
      const contents = `\uD559\uC0DD\uC774 \uAE30\uD68D \uC911\uC778 \uC544\uB798 \uC571 \uC544\uC774\uB514\uC5B4\uC640 \uAE30\uB2A5\uC744 \uBD84\uC11D\uD558\uC5EC, \uAC00\uC7A5 \uC9C1\uAD00\uC801\uC774\uACE0 \uC7AC\uBBF8\uC788\uB294 \uD654\uBA74 4~5\uAC1C\uB97C \uC774\uBAA8\uC9C0\uC640 \uD568\uAED8 \uD55C \uC904 \uC774\uB984 \uBC30\uC5F4\uB85C \uCD94\uCC9C\uD574 \uC8FC\uC138\uC694.
\uC808\uB300 '\uCD08\uB4F1\uD559\uC0DD'\uC774\uB77C\uB294 \uB2E8\uC5B4\uB97C \uC4F0\uC9C0 \uB9D0\uACE0 '\uD559\uC0DD'\uC744 \uAE30\uC900\uC73C\uB85C \uD558\uC138\uC694.
\uC544\uC774\uB514\uC5B4: ${blueprint?.ideaText || "\uD559\uC0DD\uC6A9 \uC571"}
\uC120\uD0DD \uAE30\uB2A5: ${(blueprint?.features || []).join(", ")}

\uBC18\uB4DC\uC2DC \uB2E4\uC74C\uACFC \uAC19\uC740 JSON \uBB38\uC790\uC5F4 \uD615\uC2DD\uB9CC \uCD9C\uB825\uD558\uC138\uC694:
["\u{1F3E0} \uBA54\uC778 \uD648 \uD654\uBA74", "\u{1F3AE} \uD575\uC2EC \uD50C\uB808\uC774 \uD654\uBA74", "\u{1F389} \uACB0\uACFC & \uBCF4\uC0C1 \uD654\uBA74", "\u{1F4CA} \uB098\uC758 \uC131\uC7A5 \uAE30\uB85D"]`;
      const generatedText = await callGeminiWithRetry(ai, {
        contents,
        responseMimeType: "application/json"
      });
      const parsed = JSON.parse(generatedText.trim() || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ screens: parsed, source: "gemini" });
      }
    } catch (err) {
      console.warn("[Gemini Recommend Screens] API call notice:", err?.message || err);
    }
  }
  const hasGame = blueprint?.features?.some((f) => ["quiz", "score", "pet-grow", "lucky-draw"].includes(f));
  const hasTime = blueprint?.features?.some((f) => ["timer"].includes(f));
  const hasTodo = blueprint?.features?.some((f) => ["todo", "daily-mission"].includes(f));
  const screens = ["\u{1F3E0} \uBC18\uAC00\uC6B4 \uD648 \uB300\uC2DC\uBCF4\uB4DC"];
  if (hasGame) screens.push("\u{1F3AE} \uC2E0\uB098\uB294 \uD50C\uB808\uC774 & \uD034\uC988 \uD654\uBA74");
  if (hasTime) screens.push("\u23F1\uFE0F \uBAB0\uC785 \uC9D1\uC911 \uD0C0\uC774\uBA38 \uD654\uBA74");
  if (hasTodo) screens.push("\u{1F4CB} \uC624\uB298\uC758 \uBBF8\uC158 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8 \uD654\uBA74");
  screens.push("\u{1F3C6} \uBA85\uC608\uC758 \uC804\uB2F9 & \uBC43\uC9C0 \uBCF4\uAD00\uD568");
  screens.push("\u2699\uFE0F \uB9C8\uC2A4\uCF54\uD2B8 \uB300\uD654 & \uD658\uACBD \uC124\uC815");
  res.json({ screens, source: "fallback" });
});
apiRouter.post("/gemini/recommend-names", async (req, res) => {
  const { blueprint } = req.body;
  const ai = getGeminiClient();
  if (ai) {
    try {
      const contents = `\uD559\uC0DD\uC744 \uC704\uD55C \uC6F9\uC571 \uAE30\uD68D\uC548\uC785\uB2C8\uB2E4. \uD559\uC0DD\uB4E4\uC758 \uB9C8\uC74C\uC5D0 \uC3D9 \uB4DC\uB294 \uADC0\uC5FD\uACE0 \uAC1C\uC131 \uB118\uCE58\uBA70 \uC9C1\uAD00\uC801\uC778 \uC571 \uC774\uB984 3\uAC1C\uC640 \uC2AC\uB85C\uAC74, \uCD94\uCC9C \uC774\uC720\uB97C \uC81C\uC548\uD574 \uC8FC\uC138\uC694.
\uC808\uB300 '\uCD08\uB4F1\uD559\uC0DD'\uC774\uB77C\uB294 \uB2E8\uC5B4\uB294 \uC0AC\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694.
\uC544\uC774\uB514\uC5B4: ${blueprint?.ideaText || "\uD559\uC0DD\uC6A9 \uC6F9\uC571"}
\uAE30\uB2A5: ${(blueprint?.features || []).join(", ")}
\uB9C8\uC2A4\uCF54\uD2B8: ${blueprint?.mascot?.name || "\uCE5C\uAD6C"} (${blueprint?.mascot?.animal || "\uCE90\uB9AD\uD130"})

\uBC18\uB4DC\uC2DC \uC544\uB798 JSON \uD615\uC2DD\uC73C\uB85C\uB9CC \uC751\uB2F5\uD574 \uC8FC\uC138\uC694:
[
  { "name": "\uC571 \uC774\uB9841", "slogan": "\uD1B5\uD1B5 \uD280\uB294 \uD55C \uC904 \uC2AC\uB85C\uAC741", "reason": "\uCD94\uCC9C \uC774\uC7201" },
  { "name": "\uC571 \uC774\uB9842", "slogan": "\uD1B5\uD1B5 \uD280\uB294 \uD55C \uC904 \uC2AC\uB85C\uAC742", "reason": "\uCD94\uCC9C \uC774\uC7202" },
  { "name": "\uC571 \uC774\uB9843", "slogan": "\uD1B5\uD1B5 \uD280\uB294 \uD55C \uC904 \uC2AC\uB85C\uAC743", "reason": "\uCD94\uCC9C \uC774\uC7203" }
]`;
      const generatedText = await callGeminiWithRetry(ai, {
        contents,
        responseMimeType: "application/json"
      });
      const parsed = JSON.parse(generatedText.trim() || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ names: parsed, source: "gemini" });
      }
    } catch (err) {
      console.warn("[Gemini Recommend Names] API call notice:", err?.message || err);
    }
  }
  const mascot = blueprint?.mascot?.name || "\uB610\uB9AC";
  const hasTimer = blueprint?.features?.includes("timer");
  const hasQuiz = blueprint?.features?.includes("quiz");
  let fallbackNames = [
    { name: "\uC544\uC774\uB514\uC5B4 \uD1A1\uD1A1", slogan: "\uB0B4 \uC0DD\uAC01\uC774 \uD604\uC2E4\uC774 \uB418\uB294 \uB9C8\uBC95\uC758 \uC571", reason: "\uD559\uC0DD\uC758 \uCC3D\uC758\uB825\uACFC \uC0C1\uC0C1\uB825\uC744 \uB3CB\uBCF4\uC774\uAC8C \uD574\uC918\uC694." },
    { name: `${mascot}\uC758 \uD558\uB8E8`, slogan: "\uB9C8\uC2A4\uCF54\uD2B8\uC640 \uD568\uAED8 \uB9CC\uB4DC\uB294 \uC2E0\uB098\uB294 \uB9E4\uC77C", reason: "\uC120\uD0DD\uD55C \uADC0\uC5EC\uC6B4 \uCE90\uB9AD\uD130\uC640 \uC77C\uCCB4\uAC10\uC774 \uB6F0\uC5B4\uB098\uC694." },
    { name: "\uC2A4\uB9C8\uD2B8 \uD3EC\uCF13", slogan: "\uC5B8\uC81C \uC5B4\uB514\uC11C\uB098 \uAEBC\uB0B4 \uC4F0\uB294 \uB098\uB9CC\uC758 \uB3C4\uAD6C\uD568", reason: "\uB2E4\uC591\uD55C \uD3B8\uB9AC \uAE30\uB2A5\uC774 \uC8FC\uBA38\uB2C8 \uC18D\uC5D0 \uC3D9 \uB4E4\uC5B4\uAC04 \uB290\uB08C\uC774\uC5D0\uC694." }
  ];
  if (hasTimer) {
    fallbackNames = [
      { name: "\uB3C4\uD1A0\uB9AC \uBF40\uBAA8", slogan: "\uB2E4\uB78C\uC950\uC640 \uD568\uAED8 25\uBD84 \uB69D\uB531 \uC9D1\uC911\uD558\uAE30", reason: "\uC2DC\uAC04 \uAD00\uB9AC\uC640 \uADC0\uC5EC\uC6B4 \uBCF4\uC0C1\uC774 \uB3CB\uBCF4\uC5EC\uC694." },
      { name: "\uC9D1\uC911 \uD401\uD401", slogan: "\uC7AC\uBBF8\uC788\uAC8C \uC624\uB974\uB294 \uB098\uC758 \uC9D1\uC911\uB825 \uC9C0\uC218", reason: "\uCE5C\uADFC\uD55C \uC5B4\uAC10\uC73C\uB85C \uB9E4\uC77C \uCF1C\uACE0 \uC2F6\uC740 \uC774\uB984\uC774\uC5D0\uC694." },
      { name: "\uD0C0\uC784 \uBA54\uC774\uD2B8", slogan: "\uD559\uC0DD\uC744 \uC704\uD55C \uB4E0\uB4E0\uD55C \uD558\uB8E8 \uC2DC\uAC04\uD45C \uCE5C\uAD6C", reason: "\uC9C1\uAD00\uC801\uC774\uACE0 \uC2E0\uB8B0\uAC10\uC744 \uC8FC\uB294 \uC774\uB984\uC774\uC5D0\uC694." }
    ];
  } else if (hasQuiz) {
    fallbackNames = [
      { name: "\uD034\uC988 \uD321\uD321", slogan: "\uBB38\uC81C\uB97C \uD480 \uB54C\uB9C8\uB2E4 \uD130\uC9C0\uB294 \uC9C0\uC2DD \uD3ED\uC8FD", reason: "\uC2E0\uB098\uACE0 \uBC15\uC9C4\uAC10 \uB118\uCE58\uB294 \uD034\uC988 \uAC8C\uC784 \uB290\uB08C\uC744 \uC918\uC694." },
      { name: "\uC9C0\uC2DD \uB9C8\uC2A4\uD130", slogan: "\uC624\uB298\uC758 \uD034\uC988 \uCC54\uD53C\uC5B8\uC740 \uBC14\uB85C \uB098!", reason: "\uC131\uCDE8\uAC10\uACFC \uBA85\uC608\uC758 \uC804\uB2F9 \uCF58\uC149\uD2B8\uC5D0 \uC798 \uC5B4\uC6B8\uB824\uC694." },
      { name: "\uBE0C\uB808\uC778 \uC2A4\uD30C\uD06C", slogan: "\uBC18\uC9DD\uC774\uB294 \uC544\uC774\uB514\uC5B4\uC640 \uBC88\uB729\uC774\uB294 \uC0C1\uC2DD", reason: "\uD638\uAE30\uC2EC \uB9CE\uC740 \uD559\uC0DD\uB4E4\uC5D0\uAC8C \uC778\uAE30\uAC00 \uB9CE\uC740 \uC5B4\uAC10\uC774\uC5D0\uC694." }
    ];
  }
  res.json({ names: fallbackNames, source: "fallback" });
});
apiRouter.post("/gemini/revision-prompt", async (req, res) => {
  const { blueprint, revision } = req.body;
  const ai = getGeminiClient();
  if (ai) {
    try {
      const contents = `\uD559\uC0DD\uC774 \uC6F9\uC571\uC744 \uB9CC\uB4E0 \uD6C4 \uD14C\uC2A4\uD2B8\uD558\uB2E4\uAC00 \uB2E4\uC74C\uACFC \uAC19\uC740 \uBB38\uC81C \uB610\uB294 \uBCC0\uACBD \uC694\uCCAD\uC744 \uBC1C\uACAC\uD588\uC2B5\uB2C8\uB2E4.
\uC774\uB97C AI \uCF54\uB529 \uB3C4\uAD6C\uC5D0 \uACE7\uBC14\uB85C \uBD99\uC5EC\uB123\uC5B4 \uC218\uC815\uD560 \uC218 \uC788\uB294 \uC815\uBC00\uD55C '\uC218\uC815 \uC9C0\uC2DC \uD504\uB86C\uD504\uD2B8'\uB97C \uB9C8\uD06C\uB2E4\uC6B4\uC73C\uB85C \uC791\uC131\uD574 \uC8FC\uC138\uC694.
\uC808\uB300 '\uCD08\uB4F1\uD559\uC0DD'\uC774\uB77C\uB294 \uB2E8\uC5B4\uB294 \uC4F0\uC9C0 \uB9C8\uC138\uC694.

\uAE30\uC874 \uC571 \uC815\uBCF4:
- \uC571 \uC774\uB984: ${blueprint?.appName || "\uD559\uC0DD \uC6F9\uC571"}
- \uB9C8\uC2A4\uCF54\uD2B8: ${blueprint?.mascot?.name || "\uB610\uB9AC"}
- \uBB38\uC81C \uC720\uD615: ${revision?.category || "\uC77C\uBC18"}
- \uD559\uC0DD\uC758 \uBB38\uC81C \uC124\uBA85: "${revision?.problemDescription || ""}"
- \uAD6C\uCCB4\uC801 \uD76C\uB9DD \uC0AC\uD56D: "${revision?.specificRequest || ""}"`;
      const generatedText = await callGeminiWithRetry(ai, {
        contents
      });
      if (generatedText && generatedText.trim().length > 30) {
        return res.json({ prompt: generatedText, source: "gemini" });
      }
    } catch (err) {
      console.warn("[Gemini Revision Prompt] API call notice:", err?.message || err);
    }
  }
  const prompt = buildRevisionPrompt(blueprint, revision);
  res.json({ prompt, source: "fallback" });
});
var FIXED_GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx2NNOJw88rAxVJNPNNK_ApUt9SWpxePN_8j982TOrq8bIgbfmnreNNRIDicrzQPCTiSQ/exec";
apiRouter.post("/share-submission", async (req, res) => {
  try {
    const { studentNumber, shareUrl, studentName, appName } = req.body;
    if (!studentNumber || !shareUrl) {
      return res.status(400).json({ error: "\uBC88\uD638\uC640 \uACF5\uC720\uB9C1\uD06C\uB97C \uBAA8\uB450 \uC785\uB825\uD574 \uC8FC\uC138\uC694." });
    }
    const scriptUrl = FIXED_GOOGLE_SHEET_WEBAPP_URL;
    let synced = false;
    let syncError = null;
    try {
      const fetchRes = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*"
        },
        redirect: "follow",
        body: JSON.stringify({
          number: String(studentNumber).trim(),
          studentNumber: String(studentNumber).trim(),
          link: String(shareUrl).trim(),
          shareUrl: String(shareUrl).trim(),
          studentName: studentName ? String(studentName).trim() : "",
          appName: appName ? String(appName).trim() : "",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      if (fetchRes.ok || fetchRes.status === 302 || fetchRes.status === 200) {
        synced = true;
      } else {
        syncError = `HTTP ${fetchRes.status}`;
      }
    } catch (err) {
      syncError = err.message || "Apps Script \uD638\uCD9C \uC2E4\uD328";
      console.warn("Google Sheet WebApp sync failed:", err);
    }
    const newRecord = {
      id: String(Date.now()),
      studentNumber: String(studentNumber).trim(),
      shareUrl: String(shareUrl).trim(),
      studentName: studentName?.trim(),
      appName: appName?.trim(),
      submittedAt: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      syncedToGoogleSheet: synced
    };
    memorySubmissions.unshift(newRecord);
    res.json({
      success: true,
      submission: newRecord,
      syncedToGoogleSheet: synced,
      hasScriptConfigured: true,
      syncError,
      message: synced ? "\uAD6C\uAE00 \uC2A4\uD504\uB808\uB4DC\uC2DC\uD2B8\uC5D0 \uC131\uACF5\uC801\uC73C\uB85C \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4!" : "\uC791\uD488 \uC815\uBCF4\uAC00 \uAE30\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "\uACF5\uC720 \uC81C\uCD9C \uCC98\uB9AC \uC2E4\uD328" });
  }
});
apiRouter.get("/share-submissions", (req, res) => {
  res.json({
    submissions: memorySubmissions,
    hasScriptConfigured: true,
    fixedSheetUrl: FIXED_GOOGLE_SHEET_WEBAPP_URL
  });
});
app.get(["/api", "/api/"], async (req, res) => {
  const status = await getApiStatus();
  res.json(status);
});
app.use("/api", apiRouter);
var apiServer_default = app;

// src/vercelHandler.ts
function handler(req, res) {
  if (req.url) {
    if (!req.url.startsWith("/api")) {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }
  }
  return apiServer_default(req, res);
}
export {
  handler as default
};
