package framework;

import java.io.File;
import java.net.URISyntaxException;

/**
 * Created by Henriette on 30.03.2016.
 */
public class Resources {
    private static final ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

    public static String getFilepathFromResourceFolder(String filename) {
        String path = null;
        try {
            path = new File(classLoader.getResource(filename).toURI()).getAbsolutePath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return path;
    }
}
