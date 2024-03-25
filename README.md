# Memory Optimized RecordRTC

The library is forked from RecordRTC and a new functionality is added to continuously store the recorded video
in chunks in the IndexDB. Hence you can now record larger videos without worrying about the memory issue.
Although the memory is limited to the quote alloted to the browser for the IndexDB storage by the Operating system.
