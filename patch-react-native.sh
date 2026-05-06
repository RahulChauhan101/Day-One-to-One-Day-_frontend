#!/bin/bash
# Fix React Native 0.84.1 std::format issue with NDK 26.1+

REACT_NATIVE_HEADER="node_modules/react-native/ReactAndroid/cmake-utils/react-android.cmake-utils-prefab.aar/aar/prefab/modules/reactnative/include/react/renderer/core/graphicsConversions.h"

# Check if file exists
if [ ! -f "$REACT_NATIVE_HEADER" ]; then
    echo "Header file not found at $REACT_NATIVE_HEADER"
    exit 1
fi

# Replace std::format with folly::format
sed -i 's/return std::format/return folly::format/g' "$REACT_NATIVE_HEADER"

echo "Patched graphicsConversions.h successfully"
