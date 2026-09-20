"""The collector must not invent stable versions or inspect the wrong host."""
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("capture", Path(__file__).resolve().parents[1] / "scripts/capture_technology_versions.py")
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class CaptureTests(unittest.TestCase):
    def test_preserves_prerelease(self):
        self.assertEqual(capture.extract_version("Python 3.14.0rc1"), "3.14.0rc1")

    def test_preserves_packaging_revision(self):
        self.assertEqual(capture.extract_version("OpenClaw 2026.7.1-2"), "2026.7.1-2")

    def test_missing_is_unknown(self):
        self.assertIsNone(capture.extract_version(None))

    def test_refuses_non_mac_before_running_commands(self):
        with patch.object(capture.platform, "system", return_value="Windows"), patch.object(capture, "capture") as collect, patch("sys.argv", ["capture"]):
            with self.assertRaises(SystemExit) as error:
                capture.main()
            self.assertEqual(error.exception.code, 2)
            collect.assert_not_called()


if __name__ == "__main__":
    unittest.main()
