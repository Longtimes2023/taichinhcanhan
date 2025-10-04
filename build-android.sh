#!/bin/bash

# Build script cho Android App
echo "🚀 Bắt đầu build ứng dụng Android..."

# Tạo thư mục dự án Android
PROJECT_NAME="QuanLyVay"
PACKAGE_NAME="com.yourcompany.quanlyvay"

echo "📁 Tạo cấu trúc thư mục..."
mkdir -p $PROJECT_NAME/app/src/main/java/com/yourcompany/quanlyvay
mkdir -p $PROJECT_NAME/app/src/main/res/layout
mkdir -p $PROJECT_NAME/app/src/main/res/values
mkdir -p $PROJECT_NAME/app/src/main/res/mipmap-hdpi
mkdir -p $PROJECT_NAME/app/src/main/res/mipmap-mdpi
mkdir -p $PROJECT_NAME/app/src/main/res/mipmap-xhdpi
mkdir -p $PROJECT_NAME/app/src/main/res/mipmap-xxhdpi
mkdir -p $PROJECT_NAME/app/src/main/res/mipmap-xxxhdpi

# Copy files Android
echo "📋 Copy các files Android..."
cp MainActivity.java $PROJECT_NAME/app/src/main/java/com/yourcompany/quanlyvay/
cp activity_main.xml $PROJECT_NAME/app/src/main/res/layout/
cp AndroidManifest.xml $PROJECT_NAME/app/src/main/

# Tạo strings.xml
cat > $PROJECT_NAME/app/src/main/res/values/strings.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Quản Lý Vay</string>
</resources>
EOF

# Tạo styles.xml
cat > $PROJECT_NAME/app/src/main/res/values/styles.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">#2563eb</item>
        <item name="colorPrimaryDark">#1d4ed8</item>
        <item name="colorAccent">#3b82f6</item>
    </style>
</resources>
EOF

# Tạo build.gradle (app level)
cat > $PROJECT_NAME/app/build.gradle << EOF
android {
    compileSdkVersion 33
    buildToolsVersion "30.0.3"

    defaultConfig {
        applicationId "$PACKAGE_NAME"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.4.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.0'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}
EOF

# Tạo build.gradle (project level)
cat > $PROJECT_NAME/build.gradle << EOF
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.0.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
EOF

# Tạo gradle.properties
cat > $PROJECT_NAME/gradle.properties << EOF
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
EOF

# Tạo settings.gradle
cat > $PROJECT_NAME/settings.gradle << EOF
include ':app'
EOF

echo "✅ Hoàn thành tạo dự án Android!"
echo "📱 Để build APK:"
echo "   1. Mở Android Studio"
echo "   2. Import project từ thư mục $PROJECT_NAME"
echo "   3. Sync project with Gradle files"
echo "   4. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""
echo "🌐 Đừng quên thay đổi URL trong MainActivity.java thành domain thật của bạn!"
