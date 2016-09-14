package setups;

import framework.Constants;
import org.junit.AfterClass;
import org.junit.BeforeClass;

import java.io.*;

/**
 * Created by Pascal on 01.03.2016.
 */
public class BeforeClazz {
    static Process serverProcess;
    public static Constants consts = Constants.createInstance();

    @BeforeClass
    public static void setUpServers() throws Exception {
        File file = new File("./runServer.js");
        String dirPath = file.getAbsolutePath();

        if(!file.exists()){
            throw new FileNotFoundException("runServer.js could not be found at: " + dirPath);
        };
        serverProcess = Runtime.getRuntime().exec("node " + dirPath);
        Thread nodeLogger = new Thread(new Runnable() {
            public void run() {
                BufferedReader input = new BufferedReader(new InputStreamReader(serverProcess.getInputStream()));
                String line = null;

                try {
                    while ((line = input.readLine()) != null)
                        System.out.println(line);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        nodeLogger.start();
    }

    @BeforeClass
    public static void setChromeDriverLocation() throws Exception {
        System.setProperty("webdriver.chrome.driver", consts.chromedriver);
    }

    @AfterClass
    public static void shutdownServers() throws Exception {
        serverProcess.destroy();
    }
}
