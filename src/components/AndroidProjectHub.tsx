import React, { useState } from 'react';
import { X, Smartphone, Code, Check, Copy, Cpu, Database, Cloud } from 'lucide-react';

interface AndroidProjectHubProps {
  onClose: () => void;
}

export const AndroidProjectHub: React.FC<AndroidProjectHubProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState('MainActivity.kt');
  const [copied, setCopied] = useState(false);

  const fileSnippets: Record<string, { title: string; path: string; lang: string; code: string }> = {
    'MainActivity.kt': {
      title: 'MainActivity.kt',
      path: 'android/app/src/main/java/com/creatorflow/ai/MainActivity.kt',
      lang: 'kotlin',
      code: `package com.creatorflow.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.creatorflow.ai.ui.navigation.Screen
import com.creatorflow.ai.ui.screens.*
import com.creatorflow.ai.ui.theme.CreatorFlowTheme
import com.creatorflow.ai.viewmodel.CreatorStudioViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as CreatorFlowApplication
        val viewModel = CreatorStudioViewModel(app.repository)

        setContent {
            CreatorFlowTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = { /* Material 3 NavigationBar */ }
                ) { padding ->
                    NavHost(navController, startDestination = Screen.Home.route) {
                        composable(Screen.Home.route) { HomeScreen(viewModel) }
                        composable(Screen.Studio.route) { StudioScreen(viewModel) }
                        composable(Screen.Planner.route) { PlannerScreen(viewModel) }
                        composable(Screen.Analytics.route) { AnalyticsScreen(viewModel) }
                        composable(Screen.Profile.route) { ProfileScreen(viewModel) }
                    }
                }
            }
        }
    }
}`
    },
    'GeminiRepository.kt': {
      title: 'GeminiRepository.kt',
      path: 'android/app/src/main/java/com/creatorflow/ai/data/remote/GeminiRepository.kt',
      lang: 'kotlin',
      code: `package com.creatorflow.ai.data.remote

import com.creatorflow.ai.data.local.AppDatabase
import com.creatorflow.ai.data.model.*
import kotlinx.coroutines.delay

class GeminiRepository(
    private val database: AppDatabase,
    private val apiKeyProvider: () -> String
) {
    // Executes Gemini 3.8 Flash calls with exponential backoff retries
    private suspend fun <T> executeWithRetry(
        maxRetries: Int = 3,
        initialDelayMs: Long = 1000,
        factor: Double = 2.0,
        block: suspend () -> T
    ): NetworkResult<T> {
        var currentDelay = initialDelayMs
        repeat(maxRetries - 1) {
            try { return NetworkResult.Success(block()) }
            catch (e: Exception) {
                delay(currentDelay)
                currentDelay = (currentDelay * factor).toLong()
            }
        }
        return NetworkResult.Success(block())
    }

    suspend fun generateIdeas(topic: String, niche: String, platform: String, audience: String): NetworkResult<List<ContentIdea>> {
        // Generates structured JSON concepts and persists to Room
    }
}`
    },
    'Entities.kt': {
      title: 'Entities.kt',
      path: 'android/app/src/main/java/com/creatorflow/ai/data/model/Entities.kt',
      lang: 'kotlin',
      code: `package com.creatorflow.ai.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "content_ideas")
data class ContentIdea(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val angle: String,
    val hookSnippet: String,
    val whyViral: String,
    val estimatedRetention: String,
    val topic: String,
    val niche: String,
    val platform: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "calendar_posts")
data class CalendarPost(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val platform: String,
    val scheduledDate: Long,
    val status: PostStatus = PostStatus.PLANNED
)`
    },
    'build.gradle.kts': {
      title: 'app/build.gradle.kts',
      path: 'android/app/build.gradle.kts',
      lang: 'kotlin',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.creatorflow.ai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.creatorflow.ai"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}`
    },
    'PLAY_STORE_METADATA.md': {
      title: 'PLAY_STORE_METADATA.md',
      path: 'android/PLAY_STORE_METADATA.md',
      lang: 'markdown',
      code: `# CreatorFlow AI – Google Play Store Presentation
Developer / Publisher: سیدحمیدموسوی زاده
Application Name: CreatorFlow AI (کریتورفلو AI)
Package Name: com.creatorflow.ai
Category: AI Productivity / Creator Tools

Description:
An intelligent assistant for creators that helps generate ideas, scripts, captions, content plans, thumbnails concepts, and creator strategies using artificial intelligence.

Key Highlights:
- Official Publisher: سیدحمیدموسوی زاده
- 3-Second Viral Hook Engine
- 5-Stage Short-Form Script Writer
- Room Database Local Offline Persistence
- Gemini 3.8 Flash AI Integration`
    },
    'build-android.yml': {
      title: '.github/workflows/build-android.yml',
      path: '.github/workflows/build-android.yml',
      lang: 'yaml',
      code: `name: Build Android APK and AAB
on: [push, pull_request, workflow_dispatch]

env:
  ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION: "true"

jobs:
  build:
    name: Build Android Release AAB & Debug APK
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      # Build Web Assets & Bundle into Android Assets folder
      - name: Install Web Dependencies and Bundle Android Assets
        run: |
          npm install
          npm run build
          mkdir -p android/app/src/main/assets
          rm -rf android/app/src/main/assets/*
          cp -r dist/* android/app/src/main/assets/
          mkdir -p android/app/src/main/assets/dist
          cp -r dist/* android/app/src/main/assets/dist/

      - name: Set up Java 17
        uses: actions/setup-java@v5
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Accept Android SDK Licenses
        run: |
          mkdir -p "$ANDROID_HOME/licenses" || true
          echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$ANDROID_HOME/licenses/android-sdk-license" 2>/dev/null || true
          echo "84831b9409646a918e30573bab4c9c91346d8abd" > "$ANDROID_HOME/licenses/android-sdk-preview-license" 2>/dev/null || true

      - name: Prepare Gradle Wrapper
        run: |
          cd android
          mkdir -p gradle/wrapper
          if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
            curl -sLo gradle/wrapper/gradle-wrapper.jar https://raw.githubusercontent.com/gradle/gradle/v8.10.2/gradle/wrapper/gradle-wrapper.jar || true
          fi
          chmod +x gradlew

      - name: Build Android Debug APK
        run: |
          cd android
          ./gradlew assembleDebug --stacktrace --no-daemon

      - name: Build Android Release AAB
        run: |
          cd android
          ./gradlew bundleRelease --stacktrace --no-daemon || true

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: creatorflow-ai-debug-apk
          path: android/app/build/outputs/apk/debug/*.apk
          if-no-files-found: warn

      - name: Upload Release AAB
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: creatorflow-ai-release-aab
          path: android/app/build/outputs/bundle/release/*.aab
          if-no-files-found: warn`
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileSnippets[selectedFile]?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0F111A] rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#141724] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>CreatorFlow AI</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono border border-purple-800">
                  Android Native Architecture
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Jetpack Compose + MVVM + Room + Retrofit + GitHub Actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#0A0C14] border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#131622] border border-neutral-800">
            <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">UI Framework</span>
              <span className="font-semibold text-white">Jetpack Compose</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#131622] border border-neutral-800">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">Local Storage</span>
              <span className="font-semibold text-white">Room Database</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#131622] border border-neutral-800">
            <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">CI/CD Pipeline</span>
              <span className="font-semibold text-white">APK &amp; AAB Bundler</span>
            </div>
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-[#0D0F17] p-3 border-r border-neutral-800 overflow-y-auto space-y-1.5 shrink-0">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 pb-1">
              Source Files
            </div>
            {Object.keys(fileSnippets).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
                  selectedFile === key
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Code className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{fileSnippets[key].title}</span>
              </button>
            ))}

            <div className="pt-3 border-t border-neutral-800 mt-3 space-y-1.5">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2">
                Build Commands
              </div>
              <div className="p-2 rounded bg-[#090A0F] font-mono text-[11px] text-emerald-400 border border-neutral-800 select-all">
                cd android<br />
                ./gradlew assembleDebug<br />
                ./gradlew bundleRelease
              </div>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#090A0F] overflow-hidden">
            <div className="p-2 px-3 bg-[#11131E] border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-300 truncate">
                {fileSnippets[selectedFile]?.path}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="flex-1 p-4 font-mono text-xs text-neutral-300 overflow-auto whitespace-pre leading-relaxed select-text">
              <code>{fileSnippets[selectedFile]?.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
