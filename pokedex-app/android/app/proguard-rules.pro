# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Library yang sudah membawa consumer rules sendiri (react-android, react-native-svg, Glide, OkHttp,
# Room, AndroidX) tidak perlu diulang di sini. Di bawah: library yang memakai refleksi / meminta rule.

# react-native-config — membaca field BuildConfig lewat Class.forName("<namespace>.BuildConfig").
# Tanpa ini R8 me-rename/inline BuildConfig dan `Config` di JS jadi {} (API_BASE_URL hilang).
-keep class com.kdahouse.pokedex.BuildConfig { *; }

# @d11/react-native-fast-image (Glide) — sesuai README library.
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# Reanimated & Worklets — disalin dari android/proguard-rules.pro masing-masing library
# (dipanggil dari native lewat JNI/refleksi).
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# Stack trace release tetap bisa dibaca (baris & nama file sumber dipertahankan).
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
