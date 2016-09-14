package framework;

/**
 * Created by Pascal on 23.02.2016.
 */
public class Constants {
    private static Constants instance;
    private final Settings settings;
    public final String lecturerName;
    public final String lecturerWebsite;
    public final String studentsWebsite;
    public final String defaultRoomName;
    public final String defaultRoomPwd;
    public final String chromedriver;

    private Constants() {
        this.settings = new Settings();
        String baseURL = this.createHttpAddress();
        this.lecturerName = settings.lecturerName;
        this.lecturerWebsite = baseURL + settings.lecturerHTML;
        this.studentsWebsite = baseURL + settings.studentsHTML;
        this.defaultRoomName = "roomName";
        this.defaultRoomPwd= "roomPwd";
        this.chromedriver = settings.chromedriver;

    }

    public static Constants createInstance() {
        if (instance == null) {
            instance = new Constants();
        }
        return instance;
    }

    private String createHttpAddress() {
        String protocol = settings.httpServerProtocol;
        String hostname = settings.httpServerIP;
        String port = settings.httpServerPort;
        return protocol + "://" + hostname + ":" + port + "/";
    }
};
