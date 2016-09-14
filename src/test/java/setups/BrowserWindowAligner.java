package setups;

import framework.SeleniumHelper;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;

/**
 * Created by Pascal on 08.03.2016.
 */
public class BrowserWindowAligner {

    public void align(SeleniumHelper... drivers) {
        int numWindows = drivers.length;

        //Maximise the window size to determine the height and width available
        final WebDriver.Window firstDriverWindow = drivers[0].getDriverWindow();
        firstDriverWindow.maximize();

        //Retrieve the size of the maximised window as a dimension
        Dimension windowSize = firstDriverWindow.getSize();

        //Determine the desired height and width of the window and store it as a dimension
        int desiredHeight = calculateHeight(numWindows, windowSize.getHeight());
        int desiredWidth = windowSize.width / 2;   //Half the screen width
        Dimension desiredSize = new Dimension(desiredWidth, desiredHeight);

        //Set the size of the window to the dimension determined above
        int currHeight = 0;
        for (int i = 0; i < numWindows; i++) {
            WebDriver.Window window = drivers[i].getDriverWindow();
            int x = i % 2 == 0 ? 0 : desiredWidth;
            int y;
            if (i == 0) {
                y = 0;
            } else if (i % 2 == 0) {
                currHeight += desiredHeight;
                y = currHeight;
            } else {
                y = currHeight;
            }
            window.setSize(desiredSize);
            window.setPosition(new Point(x, y));
        }
    }

    private int calculateHeight(int numWindows, int height) {
        Double div = numWindows / 2.0;
        int result;
        if (numWindows % 2 != 0) {
            div += 1;
            result = div.intValue();
        } else {
            result = div.intValue();
        }
        return height / result;
    }
}
