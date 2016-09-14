package framework;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Scanner;

/**
 * Created by Pascal on 23.02.2016.
 */
public class Settings {
    private final String chromedriverFilename = "chromedriver.exe";
    public String httpServerIP;
    public String httpServerPort;
    public String httpServerProtocol;
    public String lecturerName;
    public String lecturerHTML;
    public String studentsHTML;
    private final String settingsFile = "settings.js";
    public String chromedriver;

     public static final String lecturerDriver = "org.openqa.selenium.chrome.ChromeDriver";
//    public static final String lecturerDriver = "org.openqa.selenium.firefox.FirefoxDriver";
     public static final String student1Driver = "org.openqa.selenium.chrome.ChromeDriver";
//    public static final String student1Driver = "org.openqa.selenium.firefox.FirefoxDriver";
//    public static final String student2Driver = "org.openqa.selenium.firefox.FirefoxDriver";
    public static final String student2Driver = "org.openqa.selenium.chrome.ChromeDriver";



    public Settings(){
        try {
            HashMap<String, String> hmap = new HashMap<String, String>();
            Scanner in = new Scanner(new FileReader(new File(settingsFile).getAbsolutePath()));
            while (in.hasNext()) {
                String jsonLine = in.findWithinHorizon("\"(.*)\": \"(.*)\"", 10000);
                if (jsonLine != null) {
                    String[] keyValue = jsonLine.replace("\"", "").split(": ");
                    hmap.put(keyValue[0], keyValue[1]);
                }
                in.next();
            }

            this.httpServerIP = hmap.get("httpServerIP");
            this.httpServerPort = hmap.get("httpServerPort");
            this.httpServerProtocol = hmap.get("httpServerProtocol");
            this.lecturerName = hmap.get("lecturerName");
            this.lecturerHTML = hmap.get("lecturerHTML");
            this.studentsHTML = hmap.get("studentsHTML");

            this.chromedriver = this.getClass().getClassLoader().getResource(chromedriverFilename).getPath();


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static WebDriver getLecturerDriver() {
        return getDriverFromClassname(lecturerDriver);
    }

    public static WebDriver getStudent1Driver() {
        return getDriverFromClassname(student1Driver);
    }

    public static WebDriver getStudent2Driver() {
        return getDriverFromClassname(student2Driver);
    }

    private static WebDriver getDriverFromClassname(String driverName) {
        try {
            Class<?> clazz = Class.forName(driverName);
            return (WebDriver) clazz.newInstance();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }
}