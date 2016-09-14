package framework.utils;

import java.io.File;

/**
 * Created by Henriette on 01.04.2016.
 */
public class FileSystem {
    private static int maxRetries = 10;
    private static int waitTimeInMs = 200;
    private static int minTextLen = 10;

    // WatchService isn't platform independent. Therefore while is used.
    public static void waitTillFileExists(String savedTxtPath) {
        for (int i = 0; i < maxRetries && new File(savedTxtPath).length() < minTextLen; i++) {
            try {
                Thread.sleep(waitTimeInMs);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
