#include "exceptions/Exceptions.hpp"
#include "validation/StudentValidator.hpp"
#include <gtest/gtest.h>

using namespace studentrecords;

TEST(StudentValidatorTests, AcceptsValidStudent) {
    const Student student("S-1001", "Jane", "O'Neil", "jane.oneil@example.com", "Computer Science", 3, EnrollmentStatus::Active);
    EXPECT_NO_THROW(StudentValidator::validate(student));
}

TEST(StudentValidatorTests, RejectsInvalidEmail) {
    const Student student("S1", "Jane", "Doe", "not-an-email", "Math", 1, EnrollmentStatus::Active);
    EXPECT_THROW(StudentValidator::validate(student), ValidationException);
}

TEST(StudentValidatorTests, RejectsYearOutsideRange) {
    const Student student("S1", "Jane", "Doe", "jane@example.com", "Math", 9, EnrollmentStatus::Active);
    EXPECT_THROW(StudentValidator::validate(student), ValidationException);
}

TEST(StudentValidatorTests, RejectsMalformedStudentId) {
    EXPECT_THROW(StudentValidator::validateStudentId("bad id"), ValidationException);
}
