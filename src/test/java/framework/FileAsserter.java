package framework;

import framework.utils.*;
import org.junit.rules.TemporaryFolder;
import setups.TempFolders;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Created by Pascal on 11.03.2016.
 */
public class FileAsserter {

    public static void JSONequals(String absPath1, String absPath2) throws IOException {
        String line1 = prepareJSON(Files.readAllLines(Paths.get(absPath1), StandardCharsets.UTF_8));
        String line2 = prepareJSON(Files.readAllLines(Paths.get(absPath2), StandardCharsets.UTF_8));
        assertEquals(line1, line2);
    }

    public static void TXTequals(String absPath1, String absPath2) throws IOException {
        FileSystem.waitTillFileExists(absPath1);
        FileSystem.waitTillFileExists(absPath2);
        BufferedReader br = new BufferedReader(new FileReader(absPath1));
        BufferedReader br2 = new BufferedReader(new FileReader(absPath2));
        for (String line1, line2; (line1 = br.readLine()) != null && (line2 = br2.readLine()) != null; ) {
            assertEquals(line1, line2);
        }
    }

    public static String prepareJSON(List<String> lines) {
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            final String noWhitespace = line.trim().replaceAll("\\s+", "");
            sb.append(noWhitespace);
        }
        return sb.toString();
    }

    /**
     *  numAnswered is set to "" on load. Therefore it has to be reset in the orig file as well
     */
    public static Path removeNumAnswersCollected(String absPath, TemporaryFolder tempFolder) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(absPath), StandardCharsets.UTF_8);
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            sb.append(line.replaceAll("\"numAnswersCollected\": \"[0-9]+/[0-9]+\"", "\"numAnswersCollected\":\"\""));
        }

        return generateTempFile(sb.toString(), tempFolder, "noNumsAnswered.txt");
    }

    public static Path removePeerIdsVotedANDCreatedDate(String absPath, TemporaryFolder tempFolder) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(absPath), StandardCharsets.UTF_8);
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            sb.append(line.replaceAll("\"peerIDsVoted\":\\[.*?\\]", "\"peerIDsVoted\":\\[\\]").replaceAll("\"created\":\".*?\"+", "\"created\":\"\""));
        }

        return generateTempFile(sb.toString(), tempFolder, "noIdsAndDates.txt");
    }

    public static Path generateTempFile(String content, TemporaryFolder tempFolder, String newFilename) throws IOException {
        File newFile = new TempFolders(tempFolder).createTempFileIn(newFilename);
        BufferedWriter out = new BufferedWriter(new FileWriter(newFile));
        out.write(content);
        out.close();
        return Paths.get(newFile.getPath());
    }
}
