from django.test.runner import DiscoverRunner
from unittest import TextTestRunner, TextTestResult


class BasicColor:
    SUCCESS = '\033[92m'
    INVALID_SUCCESS = '\033[94m'
    FAIL = '\033[91m'
    WARNING = '\033[93m'
    RESET = '\033[0m'


class CustomTestResult(TextTestResult):
    def startTest(self, test):
        """Override the start method to not output test information at startup"""
        super(TextTestResult, self).startTest(test)
        # Removed default method to get all the info by using verbose param
        if self.showAll:
            pass

    def addSuccess(self, test):
        """Override the success method with only selected info"""
        super(TextTestResult, self).addSuccess(test)
        if self.showAll:
            color = BasicColor.INVALID_SUCCESS if getattr(test, "invalid_data", False) else BasicColor.SUCCESS

            test_name = test._testMethodName
            self.stream.writeln(f"{test_name} {color}[PASS]{BasicColor.RESET}")

        elif self.dots:
            self.stream.write('.')
            self.stream.flush()

    def addFailure(self, test, err):
        """Override the failure method with only selected info"""
        super(TextTestResult, self).addFailure(test, err)
        if self.showAll:
            test_name = test._testMethodName
            self.stream.writeln(f"{test_name}: {BasicColor.FAIL}[FAIL]{BasicColor.RESET}")
        elif self.dots:
            self.stream.write('F')
            self.stream.flush()

    def addError(self, test, err):
        """Override the error method with only selected info"""
        super(TextTestResult, self).addError(test, err)
        if self.showAll:
            test_name = test._testMethodName
            self.stream.writeln(f"{test_name}: {BasicColor.FAIL}[FAIL]{BasicColor.RESET} (ERROR)")
        elif self.dots:
            self.stream.write('E')
            self.stream.flush()

    def addSkip(self, test, reason):
        """Override the skip method"""
        super(TextTestResult, self).addSkip(test, reason)
        if self.showAll:
            test_name = test._testMethodName
            self.stream.writeln(f"{test_name}: {BasicColor.WARNING}[SKIP]{BasicColor.RESET}")
        elif self.dots:
            self.stream.write('s')
            self.stream.flush()


class CustomTestRunner(TextTestRunner):
    resultclass = CustomTestResult


class CustomDiscoverRunner(DiscoverRunner):
    test_runner = CustomTestRunner
