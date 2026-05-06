# Fix React Native 0.84.1 std::format issue with NDK 26.1+
# This patches graphicsConversions.h to use folly::format instead of std::format

$headerPath = "node_modules/react-native/ReactAndroid/cmake-utils/react-android.cmake-utils-prefab.aar/aar/prefab/modules/reactnative/include/react/renderer/core/graphicsConversions.h"

# Try alternative paths that might exist
$altPaths = @(
    "node_modules/react-native/build/generated/source/codegen/jni/react/renderer/core/graphicsConversions.h",
    "node_modules/.cache/react-native/graphicsConversions.h"
)

# Search in .gradle cache
$gradleCache = "$env:USERPROFILE\.gradle\caches"
if (Test-Path $gradleCache) {
    $graphicsFiles = Get-ChildItem -Path $gradleCache -Recurse -Filter "graphicsConversions.h" 2>$null
    foreach ($file in $graphicsFiles) {
        Write-Host "Found: $($file.FullName)"
        $content = Get-Content $file.FullName -Raw
        if ($content -match "std::format") {
            Write-Host "Patching: $($file.FullName)"
            $content = $content -replace 'return std::format', 'return folly::format'
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Successfully patched: $($file.FullName)"
        }
    }
}

Write-Host "Patch script completed"
