log(){
    echo "+================================================================================+"
    echo "| [INFO] $1"
    echo "+--------------------------------------------------------------------------------+"
}

log "Cleaning old files..."
grunt clean

log "Deleting old files RecordRTC.js and RecordRTC.min.js"
rm RecordRTC.js
rm RecordRTC.min.js

log "Building new files..."
grunt

log "Copying new files to connect/node_modules/recordrtc/ folder..."
cp RecordRTC.js /Users/anandmuley/Official/Projects/HopefulAging/connect/node_modules/recordrtc/RecordRTC.js