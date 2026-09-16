# ProGuard rules for CreatorFlow AI

# Keep Room database annotations and classes
-keep class androidx.room.** { *; }
-dontwarn androidx.room.**

# Keep Retrofit and OkHttp classes
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.squareup.okhttp3.** { *; }
-keep interface com.squareup.okhttp3.** { *; }
-dontwarn okio.**
-dontwarn com.squareup.okhttp3.**

# Keep Gson models
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep Coroutines
-keepnames class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**
