package setups;

import framework.utils.FileSystem;
import org.junit.Rule;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

/**
 * Created by Henriette on 01.04.2016.
 */

public class TempFolders {

    private final String studentsFolder = "Students";
    private final String lecturerFolder = "Lecturer";
    private final TemporaryFolder tempFolder;

    public TempFolders(TemporaryFolder tempFolder) {
        this.tempFolder = tempFolder;
    }

    public Path createTempStudentsFolder() throws IOException {
        Path folder = tempFolder.newFolder(studentsFolder).toPath();
        FileSystem.waitTillFileExists(folder.toString());
        return folder;
    }

    public Path createTempLecturerFolder() throws IOException {
        Path folder = tempFolder.newFolder(lecturerFolder).toPath();
        FileSystem.waitTillFileExists(folder.toString());
        return folder;
    }

    public File createTempFileIn(String filename) throws IOException {
        File newFile = tempFolder.newFile(filename);
        FileSystem.waitTillFileExists(newFile.toString());
        return newFile;
    }
}